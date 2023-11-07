const uploadFile = require("../middlewares/cloudinary");
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const uploadPicture = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ Error: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verified) {
      return res.status(401).json({ Error: "Token not valid" });
    }

    const id = uuidv4();

    const userId = verified.id;
    const user = await User.findOne({ _id: userId });
    const pictureData = {
      id,
      userId: userId,
      picture: [],
    };

    const { picture } = req.body;

    if (picture) {
      try {
        const uploadResult = await uploadFile(picture, id, "picture");
        console.log(uploadResult.secure_url);

        if (uploadResult.secure_url) {
          pictureData.picture = [uploadResult.secure_url];
        } else {
          return res.status(400).json({ Error: "Error uploading the picture" });
        }
      } catch (error) {
        return res.status(400).json({ Error: "Error uploading the picture" });
      }
    }

    try {
      user.profile = uploadResult.secure_url;
      await user.save();
      return res.status(201).json({ Success: "Picture uploaded successfully" });
    } catch (error) {
      return res.status(500).json({ Error: "Failed to create the picture" });
    }
  } catch (error) {
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { password, email, phone, interests } = req.body;
    const id = req.params.id;
    console.log(id);

    const user = await User.findOne({ _id: id });
    console.log(user);
    if (!user) {
      return res.status(400).json({ Error: "USER DOES NOT EXIST" });
    } else {
      const salt = await bcrypt.genSalt(12);

      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(hashedPassword);
      console.log(user);
      user.password = hashedPassword;
      user.email = email;
      user.phone = phone;
      user.interests = interests;
      await user.save();
      console.log("save");
      return res.status(200).json({ Success: "Password changed successfully" });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ error: e.message });
  }
};

module.exports = { updateSettings, uploadPicture };
