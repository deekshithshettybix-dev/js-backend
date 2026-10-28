import {Router} from 'express';
import {registeruser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory} from '../controllers/user.controller.js';
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
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router;