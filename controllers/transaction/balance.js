import { HttpCode } from "../../lib/constants";
import createBalance from "../../repository/transaction";

const updateBalance = async (req, res, next) => {
  try {
    const userId = teq.user.userId;
    const userBalance = req.body.balance;
    const result = await createBalance(userId, userBalance);
    if (result) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { balance: result.balance },
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

export default updateBalance;
