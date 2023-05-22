const express = require('express');
const router = express.Router();

const controller = require('./controller.js');

/**
 * @swagger
 *  /:
 *    get:
 *      tags:
 *      - OAuth
 *      description: OAuth 인증을 위한 초기화면
 *      responses:
 *       200:
 *        description: Success
 */
router.get('/', controller.index);

/**
 * @swagger
 * /authorize:
 *    get:
 *      tags:
 *      - OAuth
 *      produces:
 *      - text/plain
 *      description: Authorize URL 발급
 *      responses:
 *       200:
 *        description: Authorize URL 발급 완료
 *        examples:
 *          text/plain: https://example.com/authorize?token=abcd1234
 */

router.get('/authorize', controller.authorize);

/**
 * @swagger
 * /callback:
 *    get:
 *      tags:
 *      - OAuth
 *      description: Access token 발급, 데이터베이스에 데이터 삽입
 *      responses:
 *       200:
 *        description: Access token 발급
 */
router.get('/callback', controller.callback);

/**
 * @swagger
 * /user/{id}:
 *    get:
 *      tags:
 *      - User
 *      description: user의 수면 정보
 *      responses:
 *       200:
 *        description: user 수면 정보
 *    post:
 *      tags:
 *      - User
 *      responses:
 *       200:
 *        description: user 수면 정보
 */
router.get('/user/:id', controller.getUser);
router.post('/user/:id', controller.postUser);

/**
 * @swagger
 * /user/{id}/sleep:
 *    get:
 *      tags:
 *      - User
 *      description: user의 최적 수면환경
 *      responses:
 *       200:
 *        description: 성공
 */
router.get('/user/:id/sleep',controller.getBestSleep);

module.exports = router;