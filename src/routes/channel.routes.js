import {Router} from "express"
import {getUserChannelProfile} from '../controllers/user.controller.js';

const router = Router()

router.route("/:username").get(getUserChannelProfile)