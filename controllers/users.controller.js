const UserService = require("../services/users.service");
const jwt = require("jsonwebtoken");

class UserController {
  userService = new UserService();

  createUser = async (req, res, next) => {
    const { email, nickname, password, confirm } = req.body;
    const regPassword = /^[A-Za-z0-9]{6,20}$/;
    const regNickname = /^[A-Za-z가-힣0-9]{2,15}$/;
    const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    if (password !== confirm) {
      return res.status(411).json({ statusCode: "411: 입력하신 비밀번호가 일치하지 않습니다." });
    }

    if (!regPassword.test(password)) {
      return res.status(412).json({ statusCode: "412: 비밀번호 양식 위반." });
    }

    if (!regNickname.test(nickname)) {
      return res.status(413).json({ statusCode: "413: 닉네임 양식 위반." });
    }

    if (!regEmail.test(email)) {
      return res.status(414).json({ statusCode: "414: 이메일 양식 위반." });
    }

    const user = await this.userService.createUser(
      email,
      nickname,
      password,
      confirm
    );

    if (user) {
      return res.status(201).json({ statusCode: "201: 새로운 유저 정보가 등록되었습니다." });
    } else {
      return res.status(400).json({ statusCode: "400: 오류 발생." });
    }

  };

  checkEmail = async (req, res, next) => {
    const { email } = req.body;

    const checked = await this.userService.checkEmail(email);

    if (checked.result === true) {
      return res.json(200).json(checked);
    }
    else {
      return res.josn(400).json(checked);
    }



  };

  checkNickname = async (req, res, next) => {
    const { nickname } = req.body;

    const checked = await this.userService.checkNickname(nickname);

    if (checked.result === true) {
      return res.json(200).json(checked);
    }
    else {
      return res.josn(400).json(checked);
    }


  };

  findUser = async (req, res, next) => {
    const { user } = res.locals;

    const userinfo = await this.userService.findUser(
      user.nickname,
      user.password,
    );

    res.status(200).json({ data: userinfo });
  };

  userLogin = async (req, res, next) => {
    const { nickname, password } = req.body;
    const expires = new Date();
    const user = await this.userService.userLogin(nickname, password);



    if (user) {
      const token = jwt.sign({ userId: user._id }, "secret-key");
      expires.setMinutes(expires.getMinutes() + 60);
      res.cookie("token", token, { expires: expires });

      return res.status(200).json({ statusCode: "200: 로그인 성공.", token });
    }
    else {
      return res.status(400).json({ statusCode: "400: 오류 발생." });
    }
  };

  userLogout = async (req, res, next) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ result: true, message: "로그아웃" });
      // res.redirect("/");

    } catch (error) {
      res.status(400).json({ result: false, error: "네트워크 에러" });
    }

  };

  findUser = async (req, res, next) => {
    const { user } = res.locals;

    const userinfo = await this.userService.findUser(
      user.nickname,
      user.password,
    );

    res.status(200).json({ data: userinfo });
  };


}

module.exports = UserController;
