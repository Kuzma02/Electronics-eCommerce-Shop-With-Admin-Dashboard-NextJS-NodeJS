# Electronics eCommerce Shop With Admin Dashboard NextJS NodeJS

# Instructions
1. To run the app you first need to download and install Node.js and npm on your computer. Here is a link to the tutorial that explains how to install them: [https://www.youtube.com/watch?v=4FAtFwKVhn0](https://www.youtube.com/watch?v=4FAtFwKVhn0). Also here is the link where you can download them: [https://nodejs.org/en](https://nodejs.org/en)
2. When you install Node.js and npm on your computer you need to download and install MySQL on your computer. Here is another link to the tutorial which explains how you can download and install MySQL on your computer: [https://www.youtube.com/watch?v=BxdSUGBs0gM&t=212s](https://www.youtube.com/watch?v=BxdSUGBs0gM&t=212s). Here is a link where you can download MySQL: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
3. This step is optional, but highly recommended if you don't have a database management app. Because HeidiSQL is beginner-friendly and very easy to use than other database management options. Here is a link to the tutorial which explains how to download and install HeidiSQL: [https://www.youtube.com/watch?v=oJ24MyLeiPs](https://www.youtube.com/watch?v=oJ24MyLeiPs) and here is a link where you can download it: [https://www.heidisql.com/](https://www.heidisql.com/)
4. When you install all the programs you need on your computer you need to download the project. When you download the project, you need to extract it.
5. After you extract the project you need to open the project folder in your code editor and in the root create a file with the name .env.
6. You need to put the following code in the .env file and instead of username and password put your MySQL username and password.
```
DATABASE_URL="mysql://username:password@localhost:3306/singitronic_nextjs"
NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
NEXTAUTH_URL=http://localhost:3000
```
7. After you do it, you need to create another .env file in the server folder and put the same DATABASE_URL you used in the previous .env file:
```
DATABASE_URL="mysql://username:password@localhost:3306/singitronic_nextjs"
```
8. Now you need to open your terminal of choice in the root folder of the project and write:
```
npm install
```
9. Now you need to navigate with the terminal in the server folder and install everything:
```
cd server
npm install
```
10. You will need to run the Prisma migration now. Make sure you are in the server folder and write:
```
npx prisma migrate dev
```
11. Next is to insert demo data. To do it you need to go to the server/utills folder and call insertDemoData.js:
```
cd utills
node insertDemoData.js
```
12. Now you can go back to the server folder and run the backend:
```
cd ..
node app.js
```
13. While your backend is running you need to open another terminal(don't stop the backend). In the second terminal, you need to make sure you are in your root project folder and write the following:
```
npm run dev
```
14. Open [http://localhost:3000](http://localhost:3000) and see it live!
