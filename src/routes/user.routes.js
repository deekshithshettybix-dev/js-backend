import {Router} from 'express';
import {registeruser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),registeruser);

router.route("/login").post(loginUser)

//secured
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(changeCurrentPassword)
router.route("/").get(getCurrentUser)
router.route("/update-account-detail").post(updateAccountDetails)
router.route("/update-avatar").post(updateUserAvatar)
router.route("/update-cover-image").post(updateUserCoverImage)
export default router;