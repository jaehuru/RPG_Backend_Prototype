## 프로젝트 개요
> *3D RPG 게임용 프로토타입 백엔드 서버 프로젝트*  
- 사용자 계정 생성 (회원가입)
- 사용자 로그인 및 인증
- JWT(JSON Web Token)를 사용한 세션 관리 및 API 인증
- 플레이어 데이터 저장 및 조회

---

## 기술 스택

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** SQLite  
- **Authentication:**
  - `jsonwebtoken` (JWT 생성 및 검증)
  - `bcrypt` (비밀번호 해싱)
- **기타:**
  - `dotenv` (환경 변수 관리)
  - `cors` (Cross-Origin Resource Sharing)

---

## 설치 및 실행

### 1. 레포지토리 클론
```bash
git clone <your-repository-url>
cd GameAuthServerPrototype
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성
```env
# .env example

# 서버가 실행될 포트를 지정
PORT=3000

# JWT(JSON Web Token)를 서명하고 검증하는데 사용되는 비밀 키
# 보안을 위해 임의의 긴 문자열로 설정
JWT_SECRET=your-super-secret-key

# 데이터 베이스 파일의 경로 지정
DATABASE_URL="sqlite:./src/db/game.db"

# 디버그 로그
DEBUG=True
NODE_ENV=development
```

### 4. 서버 실행
```bash
node server.js
```
콘솔에 `Connected to the game.db database.` 메시지가 출력되면 정상 실행입니다.

---

## 데이터베이스 (SQLite)
- 파일 위치: `/src/db/game.db`
- 테이블 구조:

**users**
컬럼 | 설명  
---|---  
id | Primary Key  
username | 사용자 이름 (고유)  
email | 이메일 (고유)  
password | bcrypt 해시된 비밀번호  

**player_data**
컬럼 | 설명  
---|---  
user_id | users 테이블의 id (Foreign Key)  
data | 플레이어 데이터(JSON 문자열, 위치/인벤토리/스탯 등)  

---

## 인증 방식
1. **회원가입**  
   - 비밀번호는 bcrypt로 해싱 후 DB에 저장

2. **로그인**  
   - 입력한 비밀번호와 DB 해시값 비교
   - 로그인 성공 시 JWT 발급

3. **JWT 토큰**  
   - Payload: user.id, user.username 등 사용자 정보 포함  
   - 서명: `.env`의 JWT_SECRET  
   - 유효기간: 1시간  
   - 클라이언트는 보호된 API 요청 시 `Authorization: Bearer <token>` 헤더 포함

---

## API 엔드포인트

1. **회원가입**  
   POST `/api/auth/register`  
   Request Body:  
   ```json
   {
     "username": "player1",
     "email": "player1@example.com",
     "password": "123456"
   }
   ```  
   Response:  
   ```json
   {
     "message": "Registration successful"
   }
   ```

2. **로그인**  
   POST `/api/auth/login`  
   Request Body:  
   ```json
   {
     "username": "player1",
     "password": "123456"
   }
   ```  
   Response:  
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   }
   ```

3. **플레이어 데이터 조회**  
   GET `/api/playerdata`  
   Headers: `Authorization: Bearer <token>`  
   Response:  
   ```json
   {
     "data": { "position": [0,0,0], "inventory": [], "stats": {...} }
   }
   ```

4. **플레이어 데이터 저장/업데이트**  
   POST `/api/playerdata`  
   Headers: `Authorization: Bearer <token>`  
   Request Body:  
   ```json
   {
     "data": { "position": [1,2,3], "inventory": [...], "stats": {...} }
   }
   ```  
   Response:  
   ```json
   {
     "message": "Player data saved successfully"
   }
   ```

---

## 참고
- 서버 실행 전 `.env` 파일 필수  
- SQLite DB 파일이 없으면 서버 시작 시 자동 생성  
- JWT는 1시간 후 만료되므로, 장기 플레이어 인증 시 토큰 갱신 필요 
