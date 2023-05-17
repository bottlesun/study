import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Post from "../entity/Post";
import Sub from "../entity/Sub";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/auth";
import userMiddleware from "../middlewares/user";

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;

  // 유저 정보가 있다면 sub 이름과 제목이 있는지 체크
  try {
    let error: Error | any = {};
    //isEmpty()는 class-validator 에서 제공하는 함수로, 해당 값이 비어있는지 확인해준다.
    if (isEmpty(name)) error.name = "이름은 비워둘 수 없습니다.";
    if (isEmpty(title)) error.title = "제목은 비워둘 수 없습니다.";

    // sub는 이미 존재하는지 확인
    // await AppDataSource 에서 getRepository()를 통해 Sub 를 가져온다.
    // createQueryBuilder()를 통해 sub 테이블을 가져온다.
    // where()를 통해 sub 테이블의 name 컬럼이 name 과 일치하는지 확인한다.
    // getOne()을 통해 하나의 데이터만 가져온다.
    const sub = await AppDataSource.getRepository(Sub).createQueryBuilder("sub").where("lower(sub.name) = :name", { name: name.toLowerCase() }).getOne();

    if (sub) error.name = "서브가 이미 존재합니다.";
    if (Object.keys(error).length > 0) throw error;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }

  // 유저 정보가 있다면 sub 를 생성
  try {
    const user: User = res.locals.user;
    // Sub Instance 생성 후 데이터베이스에 저장
    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();

    // 저장한 정보 프론트엔드로 전달
    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE(s."imageUrn", 'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
      // count(p.id) as "postCount" 는 p.id 의 갯수를 postCount 로 가져온다.
      .from(Sub, "s") // Sub 테이블을 가져온다.
      .leftJoin(Post, "p", `s.name = p."subName"`) //   Post 테이블을 가져온다.
      .groupBy('s.title, s.name, "imageUrl"') // s.title, s.name, "imageUrl" 의 그룹을 가져온다.
      .orderBy(`"postCount"`, "DESC") // postCount 를 기준으로 내림차순 정렬
      .limit(5) // 5개만 가져온다.
      .execute(); // 실행

    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();

// 미들웨어 연결
router.post("/", userMiddleware, authMiddleware, createSub);
router.get("/sub/topSubs", topSubs);
export default router;
