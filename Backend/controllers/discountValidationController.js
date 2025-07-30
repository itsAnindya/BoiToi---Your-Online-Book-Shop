const db = require('../config/database');

/**
 * Validate and apply discount code for checkout
 */
const validateDiscountCode = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Discount code and order amount are required'
      });
    }

    console.log(`Validating discount code: ${code} for order amount: ${orderAmount}`);

    // Check if discount exists and is active
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
        d.MIN_EXPENSE
      FROM discount d
      WHERE d.CODE = ? 
        AND d.STARTED_AT <= NOW() 
        AND d.ENDED_AT >= NOW()
        AND (d.MAX_USAGE IS NULL OR d.TIMES_USED < d.MAX_USAGE)
    `;

    db.query(sql, [code.toUpperCase()], (err, results) => {
      if (err) {
        console.error('Database error during discount validation:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error during discount validation'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Invalid or expired discount code'
        });
      }

      const discount = results[0];

      // Check minimum expense requirement
      if (discount.MIN_EXPENSE && orderAmount < discount.MIN_EXPENSE) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ৳${discount.MIN_EXPENSE} required for this discount`
        });
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discount.DISCOUNT_TYPE === 'percentage') {
        discountAmount = orderAmount * discount.PERCENTAGE;
      } else if (discount.DISCOUNT_TYPE === 'fixed') {
        discountAmount = Math.min(discount.VALUE, orderAmount);
      }

      return res.status(200).json({
        success: true,
        message: 'Discount code is valid',
        data: {
          discount: {
            id: discount.ID,
            code: discount.CODE,
            description: discount.DESCRIPTION,
            discountType: discount.DISCOUNT_TYPE,
            percentage: parseFloat(discount.PERCENTAGE || 0),
            value: parseFloat(discount.VALUE || 0),
            startedAt: discount.STARTED_AT,
            endedAt: discount.ENDED_AT,
            maxUsage: discount.MAX_USAGE,
            timesUsed: discount.TIMES_USED,
            minExpense: parseFloat(discount.MIN_EXPENSE || 0)
          },
          calculatedDiscount: discountAmount
        }
      });
    });

  } catch (error) {
    console.error('Unexpected error in validateDiscountCode:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  validateDiscountCode
};
