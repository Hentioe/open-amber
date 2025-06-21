import { Resend } from "resend";
import config from "../config";

export default new Resend(config.RESEND_API_KEY);
