import { Request, Response, NextFunction } from "express"
import { CustomError } from "../shared/utils/customError"
import { UserRepository } from "../modules/user/repository/user.repository"

export const ensureUserIsActive = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user?.id) {
    return next(new CustomError("Unauthorized", 401))
  }

  const user = await UserRepository.findById(req.user.id)

  if (!user) {
    return next(new CustomError("User not found", 401))
  }

  if (!user.isActive) { 
    return next(
      new CustomError(
        user.blockReason
          ? `Your account has been blocked. Reason: ${user.blockReason}`
          : "Your account has been blocked. Please contact support.",
        403
      )
    )
  }

  next()
}
