const User = require("../models/User");

const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      userEmail: "umerkhayam1717@gmail.com",
    });

    if (!existingAdmin) {
      const admin = await User.create({
        userName: "Umer Khayam",
        userEmail: "umerkhayam1717@gmail.com",
        userPassword: "umer@1234", // hashed automatically via schema
        userRole: "admin",
        userPermissions: ["all"], // full access
        contactNumber: "+923165511251",
      });
      console.log("✅ Initial Admin created:", admin.userEmail);
    } else {
      console.log("✅ Admin already exists:", existingAdmin.userEmail);
    }
  } catch (err) {
    console.error("❌ Error initializing admin:", err);
  }
};

module.exports = initializeAdmin;
