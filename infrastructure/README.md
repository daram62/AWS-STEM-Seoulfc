# AWS STEM Agent 웹앱 인프라

학생들이 직접 만든 Bedrock Agent를 테스트할 수 있는 웹 인터페이스입니다.

## 📁 구조

```
infrastructure/
├── README.md                    # 이 파일
├── cloudformation/
│   └── template.yaml           # CloudFormation 템플릿
└── web-app/
    ├── index.html              # 웹앱 UI
    ├── app.js                  # Agent 호출 로직
    └── style.css               # 인스타 DM 스타일
```

## 🚀 배포 가이드 (학생용)

### Step 1: CloudFormation 스택 배포

1. **AWS 콘솔 로그인**
   - Workshop 계정으로 로그인
   - 리전: **서울 (ap-northeast-2)** 확인

2. **CloudFormation 서비스 이동**
   - 서비스 검색에서 "CloudFormation" 입력
   - CloudFormation 콘솔 열기

3. **스택 생성**
   ```
   ① "스택 생성" 버튼 클릭
   ② "템플릿 준비" → "템플릿 준비 완료" 선택
   ③ "템플릿 소스" → "템플릿 파일 업로드" 선택
   ④ "파일 선택" → cloudformation/template.yaml 업로드
   ⑤ "다음" 클릭
   ```

4. **스택 세부 정보 지정**
   ```
   스택 이름: aws-stem-agent-webapp-[본인이름]
   예시: aws-stem-agent-webapp-minseo
   
   "다음" 클릭
   ```

5. **스택 옵션 구성**
   ```
   기본값 그대로 유지
   "다음" 클릭
   ```

6. **검토 및 생성**
   ```
   ① 하단으로 스크롤
   ② ✅ "AWS CloudFormation에서 IAM 리소스를 생성할 수 있음을 승인합니다." 체크
   ③ "제출" 클릭
   ```

7. **배포 대기** (약 10-15분)
   ```
   Status: CREATE_IN_PROGRESS → CREATE_COMPLETE
   
   ⚠️ 참고: CloudFront 배포로 인해 시간이 걸립니다.
   ```

### Step 2: 웹앱 파일 업로드

1. **S3 버킷 찾기**
   ```
   ① CloudFormation → 스택 → "Outputs" 탭
   ② "WebAppBucketName" 값 복사
   ③ S3 콘솔로 이동
   ④ 복사한 버킷 이름 검색
   ```

2. **파일 업로드**
   ```
   ① 버킷 열기
   ② "업로드" 버튼 클릭
   ③ web-app 폴더의 모든 파일 선택:
      - index.html
      - app.js
      - style.css
   ④ "업로드" 클릭
   ```

### Step 3: 웹앱 URL 확인

1. **CloudFormation Outputs에서 확인**
   ```
   ① CloudFormation 콘솔로 돌아가기
   ② 본인 스택 선택
   ③ "Outputs" 탭 클릭
   ④ "WebAppURL" 값 복사 (CloudFront URL)
   ```

2. **접속 테스트**
   ```
   ① 복사한 URL을 브라우저에 붙여넣기
   ② 웹앱이 정상적으로 로드되는지 확인
   ```

---

## 🤖 Agent 생성 및 테스트

### Step 4: AWS 리소스 생성

1. **S3 버킷 생성 (Knowledge Base용)**
   ```
   버킷 이름: aws-stem-kb-[본인이름]
   리전: ap-northeast-2 (서울)
   ```

2. **문서 업로드**
   ```
   예시: 학교 안내 문서, 동아리 정보 등
   ```

3. **Knowledge Base 생성**
   ```
   ① Bedrock 콘솔 이동
   ② Knowledge Bases → Create
   ③ S3 버킷 연결
   ```

4. **Agent 생성**
   ```
   ① Bedrock 콘솔 → Agents
   ② Create Agent
   ③ 프롬프트 작성
   ④ Knowledge Base 연결
   ⑤ Agent ID 복사
   ```

### Step 5: 테스트

1. **웹앱에서 테스트**
   ```
   ① 웹앱 URL 접속
   ② Agent ID 입력창에 붙여넣기
   ③ "연결" 버튼 클릭
   ④ 채팅 시작!
   ```

---

## 📋 Outputs 정보

| 이름 | 설명 | 예시 |
|------|------|------|
| **WebAppURL** | 웹앱 접속 URL (CloudFront) | `https://d111111abcdef8.cloudfront.net` |
| **WebAppBucketName** | S3 버킷 이름 | `aws-stem-webapp-xxx-webappbucket-yyy` |
| **ApiEndpoint** | API Gateway URL | `https://abc123.execute-api.ap-northeast-2.amazonaws.com/prod` |

---

## 🔧 문제 해결

### 웹앱이 로드되지 않아요
```
✅ 체크리스트:
- S3 버킷에 파일이 업로드되었나요?
- CloudFront 배포가 완료되었나요? (Deployed 상태)
- 올바른 URL을 사용하고 있나요? (Outputs 탭 확인)
```

### Agent 연결이 안 돼요
```
✅ 체크리스트:
- Agent ID가 정확한가요?
- Agent가 활성화(Active) 상태인가요?
- Knowledge Base가 연결되어 있나요?
```

### 응답이 너무 느려요
```
정상입니다! Bedrock Agent는 다음 작업을 수행합니다:
1. 질문 이해
2. Knowledge Base 검색
3. 응답 생성
→ 보통 5-10초 소요
```

---

## 🧹 리소스 정리

실습 종료 후 반드시 리소스를 삭제하세요!

### 1. Agent 삭제
```
Bedrock 콘솔 → Agents → 본인 Agent → Delete
```

### 2. Knowledge Base 삭제
```
Bedrock 콘솔 → Knowledge Bases → 본인 KB → Delete
```

### 3. S3 버킷 비우기 및 삭제
```
S3 콘솔 → 본인 버킷 → "Empty" → "Delete"
```

### 4. CloudFormation 스택 삭제
```
CloudFormation 콘솔 → 본인 스택 → "Delete"
```

⚠️ **주의**: 스택 삭제 시 모든 리소스가 자동으로 삭제됩니다.

---

## 💰 비용 정보

**Workshop 계정 사용 시 비용 없음**

참고용 예상 비용 (실제 AWS 계정 사용 시):
- CloudFront: ~$0.01/월
- API Gateway: ~$0.00 (소량)
- Lambda: ~$0.00 (소량)
- S3: ~$0.01/월
- Bedrock Agent: 요청당 과금

---

## 📞 지원

문제가 발생하면 손을 들어주세요! 🙋‍♂️
