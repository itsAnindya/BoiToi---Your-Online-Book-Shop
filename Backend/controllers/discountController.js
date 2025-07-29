const db = require('../config/database');

/**
 * Get all discounts with optional filtering and pagination
 */
const getAllDiscounts = async (req, res) => {
  try {
    const { 
      search = '', 
      status = 'all', 
      sort = 'newest',
      page = 1,
      limit = 10 
    } = req.query;

    console.log(`Fetching discounts - Search: ${search}, Status: ${status}, Sort: ${sort}`);

    let whereClause = '1=1';
    const queryParams = [];

    // Search filter
    if (search && search.trim() !== '') {
      whereClause += ' AND (d.CODE LIKE ? OR d.DESCRIPTION LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Status filter
    if (status !== 'all') {
      if (status === 'active') {
        whereClause += ' AND d.STARTED_AT <= NOW() AND d.ENDED_AT >= NOW()';
      } else if (status === 'inactive') {
        whereClause += ' AND (d.STARTED_AT > NOW() OR d.ENDED_AT < NOW())';
      } else if (status === 'expired') {
        whereClause += ' AND d.ENDED_AT < NOW()';
      }
    }

    // Sorting
    let orderClause = 'ORDER BY d.ADDED_AT DESC'; // Default: newest first
    if (sort === 'oldest') {
      orderClause = 'ORDER BY d.ADDED_AT ASC';
    } else if (sort === 'code') {
      orderClause = 'ORDER BY d.CODE ASC';
    } else if (sort === 'usage') {
      orderClause = 'ORDER BY d.TIMES_USED DESC';
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryParams.push(parseInt(limit), offset);

    const sql = `
      SELECT 
        d.ID,
        d.CODE,
        d.DESCRIPTION,
        d.DISCOUNT_TYPE,
        d.PERCENTAGE,
        d.VALUE,
        d.STARTED_AT,
        d.ENDED_AT,
        d.MAX_USAGE,
        d.TIMES_USED,
        d.ADDED_AT,
        d.MIN_EXPENSE,
        u.USERNAME as ADDED_BY_USERNAME,
        CASE 
          WHEN d.STARTED_AT <= NOW() AND d.ENDED_AT >= NOW() THEN 'active'
          WHEN d.STARTED_AT > NOW() THEN 'scheduled'
          WHEN d.ENDED_AT < NOW() THEN 'expired'
          ELSE 'inactive'
        END as STATUS
      FROM discount d
      LEFT JOIN admin a ON d.ADDED_BY = a.USER_ID
      LEFT JOIN user u ON a.USER_ID = u.ID
      WHERE ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    db.query(sql, queryParams, (err, results) => {
      if (err) {
        console.error('Database error during discount fetch:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error during discount fetch'
        });
      }

      // Count total for pagination
      const countSql = `
        SELECT COUNT(*) as total
        FROM discount d
        WHERE ${whereClause}
      `;
      
      const countParams = queryParams.slice(0, -2); // Remove limit and offset

      db.query(countSql, countParams, (countErr, countResults) => {
        if (countErr) {
          console.error('Database error during count:', countErr);
          return res.status(500).json({
            success: false,
            message: 'Server error during count'
          });
        }

        const total = countResults[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.status(200).json({
          success: true,
          message: 'Discounts fetched successfully',
          data: {
            discounts: results.map(discount => ({
              id: discount.ID,
              code: discount.CODE,
              description: discount.DESCRIPTION,
              discountType: discount.DISCOUNT_TYPE,
              percentage: parseFloat(discount.PERCENTAGE || 0),
              value: parseFloat(discount.VALUE || 0),
              startedAt: discount.STARTED_AT,
              endedAt: discount.ENDED_AT,
              maxUsage: discount.MAX_USAGE,
              timesUsed: discount.TIMES_USED || 0,
              addedAt: discount.ADDED_AT,
              minExpense: parseFloat(discount.MIN_EXPENSE || 0),
              addedBy: discount.ADDED_BY_USERNAME,
              status: discount.STATUS
            })),
            pagination: {
              currentPage: parseInt(page),
              totalPages,
              totalItems: total,
              itemsPerPage: parseInt(limit),
              hasNext: parseInt(page) < totalPages,
              hasPrev: parseInt(page) > 1
            }
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in getAllDiscounts:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new discount
 */
const createDiscount = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      percentage,
      value,
      startedAt,
      endedAt,
      maxUsage,
      minExpense
    } = req.body;

    // Get admin ID from session/token (assuming it's available)
    const adminId = req.body.adminId || req.user?.id || 1; // Default to 1 for testing

    console.log('Creating discount with data:', req.body);

    // Validation
    if (!code || !description || !discountType || !startedAt || !endedAt) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: code, description, discountType, startedAt, endedAt'
      });
    }

    if (discountType === 'percentage' && (!percentage || percentage <= 0 || percentage > 1)) {
      return res.status(400).json({
        success: false,
        message: 'Percentage must be between 0.01 and 1.00 for percentage discounts'
      });
    }

    if (discountType === 'fixed' && (!value || value <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Value must be greater than 0 for fixed amount discounts'
      });
    }

    // Check if code already exists
    const checkCodeSql = 'SELECT ID FROM discount WHERE CODE = ?';
    
    db.query(checkCodeSql, [code], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Database error during code check:', checkErr);
        return res.status(500).json({
          success: false,
          message: 'Server error during validation'
        });
      }

      if (checkResults.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Discount code already exists'
        });
      }

      // Insert new discount
      const insertSql = `
        INSERT INTO discount (
          CODE, DESCRIPTION, DISCOUNT_TYPE, PERCENTAGE, VALUE,
          STARTED_AT, ENDED_AT, MAX_USAGE, TIMES_USED, 
          ADDED_AT, ADDED_BY, MIN_EXPENSE
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), ?, ?)
      `;

      const insertParams = [
        code,
        description,
        discountType,
        discountType === 'percentage' ? percentage : null,
        discountType === 'fixed' ? value : null,
        startedAt,
        endedAt,
        maxUsage || null,
        adminId,
        minExpense || null
      ];

      db.query(insertSql, insertParams, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Database error during discount creation:', insertErr);
          return res.status(500).json({
            success: false,
            message: 'Server error during discount creation'
          });
        }

        console.log(`Discount created successfully with ID: ${insertResult.insertId}`);

        return res.status(201).json({
          success: true,
          message: 'Discount created successfully',
          data: {
            id: insertResult.insertId,
            code,
            description,
            discountType,
            percentage: discountType === 'percentage' ? parseFloat(percentage) : null,
            value: discountType === 'fixed' ? parseFloat(value) : null,
            startedAt,
            endedAt,
            maxUsage,
            minExpense: parseFloat(minExpense || 0)
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in createDiscount:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update discount status (activate/deactivate)
 */
const updateDiscountStatus = async (req, res) => {
  try {
    const { discountId } = req.params;
    const { action } = req.body; // 'activate' or 'deactivate'

    console.log(`Updating discount ${discountId} with action: ${action}`);

    if (!['activate', 'deactivate'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "activate" or "deactivate"'
      });
    }

    // Get current discount data
    const selectSql = 'SELECT * FROM discount WHERE ID = ?';
    
    db.query(selectSql, [discountId], (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Database error during discount fetch:', selectErr);
        return res.status(500).json({
          success: false,
          message: 'Server error during discount fetch'
        });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
      }

      const discount = selectResults[0];
      let updateSql, updateParams;

      if (action === 'activate') {
        // Activate: Set start time to now if it's in the future
        updateSql = `
          UPDATE discount 
          SET STARTED_AT = CASE 
            WHEN STARTED_AT > NOW() THEN NOW() 
            ELSE STARTED_AT 
          END
          WHERE ID = ?
        `;
        updateParams = [discountId];
      } else {
        // Deactivate: Set end time to now
        updateSql = 'UPDATE discount SET ENDED_AT = NOW() WHERE ID = ?';
        updateParams = [discountId];
      }

      db.query(updateSql, updateParams, (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Database error during discount update:', updateErr);
          return res.status(500).json({
            success: false,
            message: 'Server error during discount update'
          });
        }

        console.log(`Discount ${discountId} ${action}d successfully`);

        return res.status(200).json({
          success: true,
          message: `Discount ${action}d successfully`,
          data: {
            id: parseInt(discountId),
            action,
            updatedAt: new Date().toISOString()
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in updateDiscountStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete a discount
 */
const deleteDiscount = async (req, res) => {
  try {
    const { discountId } = req.params;

    console.log(`Deleting discount ${discountId}`);

    // Check if discount exists
    const checkSql = 'SELECT ID FROM discount WHERE ID = ?';
    
    db.query(checkSql, [discountId], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Database error during discount check:', checkErr);
        return res.status(500).json({
          success: false,
          message: 'Server error during discount check'
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Discount not found'
        });
      }

      // Delete discount
      const deleteSql = 'DELETE FROM discount WHERE ID = ?';
      
      db.query(deleteSql, [discountId], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Database error during discount deletion:', deleteErr);
          return res.status(500).json({
            success: false,
            message: 'Server error during discount deletion'
          });
        }

        console.log(`Discount ${discountId} deleted successfully`);

        return res.status(200).json({
          success: true,
          message: 'Discount deleted successfully',
          data: {
            id: parseInt(discountId),
            deletedAt: new Date().toISOString()
          }
        });
      });
    });

  } catch (error) {
    console.error('Unexpected error in deleteDiscount:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get discount statistics for dashboard
 */
const getDiscountStatistics = async (req, res) => {
  try {
    console.log('Fetching discount statistics');

    const statsSql = `
      SELECT 
        COUNT(*) as total_discounts,
        SUM(CASE WHEN STARTED_AT <= NOW() AND ENDED_AT >= NOW() THEN 1 ELSE 0 END) as active_discounts,
        SUM(CASE WHEN ENDED_AT < NOW() THEN 1 ELSE 0 END) as expired_discounts,
        SUM(CASE WHEN STARTED_AT > NOW() THEN 1 ELSE 0 END) as scheduled_discounts,
        SUM(TIMES_USED) as total_usage,
        AVG(TIMES_USED) as avg_usage_per_discount,
        MAX(TIMES_USED) as max_usage,
        COUNT(CASE WHEN DISCOUNT_TYPE = 'percentage' THEN 1 END) as percentage_discounts,
        COUNT(CASE WHEN DISCOUNT_TYPE = 'fixed' THEN 1 END) as fixed_discounts
      FROM discount
    `;

    db.query(statsSql, (err, results) => {
      if (err) {
        console.error('Database error during stats fetch:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error during stats fetch'
        });
      }

      const stats = results[0];

      return res.status(200).json({
        success: true,
        message: 'Discount statistics fetched successfully',
        data: {
          totalDiscounts: stats.total_discounts || 0,
          activeDiscounts: stats.active_discounts || 0,
          expiredDiscounts: stats.expired_discounts || 0,
          scheduledDiscounts: stats.scheduled_discounts || 0,
          totalUsage: stats.total_usage || 0,
          avgUsagePerDiscount: parseFloat(stats.avg_usage_per_discount || 0).toFixed(2),
          maxUsage: stats.max_usage || 0,
          discountTypes: {
            percentage: stats.percentage_discounts || 0,
            fixed: stats.fixed_discounts || 0
          }
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in getDiscountStatistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllDiscounts,
  createDiscount,
  updateDiscountStatus,
  deleteDiscount,
  getDiscountStatistics
};
