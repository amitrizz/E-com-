# Create an admin user in MongoDB

Shopper accounts are created via **/signup** (`role: "user"` only).

To add an admin, insert a document in the `kashu_users` collection:

```javascript
// In MongoDB shell or Compass — generate hash first (see below)
{
  email: "admin@kashu.in",
  passwordHash: "<bcrypt hash>",
  name: "Store Admin",
  role: "admin",
  createdAt: new Date()
}
```

Generate `passwordHash` from the project folder:

```bash
node -e "const b=require('bcryptjs'); b.hash('YourSecurePassword', 12).then(console.log)"
```

Then sign in at **/login** with that email and password. You will be routed to **/admin/products** automatically.
