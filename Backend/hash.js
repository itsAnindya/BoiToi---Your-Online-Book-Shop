import { hash as _hash } from 'bcrypt';

const password = 'admin123'; // Replace this with any password you want

_hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});
// This code uses the bcrypt library to hash a password.
// The password is set to 'admin123', but you can replace it with any password you want to hash.
// The bcrypt.hash function takes the password and a salt rounds value (10 in this case) as arguments.
// It returns a promise that resolves to the hashed password.
// The hashed password is then logged to the console.
// This is a common practice for securely storing passwords in a database.
// Hashing passwords helps protect user credentials in case of a data breach.
// The bcrypt library is widely used for password hashing due to its security features and ease of use.
// The code demonstrates how to hash a password using bcrypt.
// It is important to note that the hashed password should be stored in a secure manner, such as in a database.
// When a user attempts to log in, the hashed password can be compared with the provided password using bcrypt.compare.
// This ensures that the original password is never stored in plain text, enhancing security.
// Overall, this code snippet is a simple example of how to hash a password using bcrypt in Node.js.
// It is a crucial step in implementing secure authentication in web applications.
// The bcrypt library is a popular choice for password hashing due to its security features and ease of use.
// The code demonstrates how to hash a password using bcrypt.
// It is important to note that the hashed password should be stored in a secure manner, such as in a database.
// When a user attempts to log in, the hashed password can be compared with the provided password using bcrypt.compare.
// This ensures that the original password is never stored in plain text, enhancing security.
// Overall, this code snippet is a simple example of how to hash a password using bcrypt in Node.js.