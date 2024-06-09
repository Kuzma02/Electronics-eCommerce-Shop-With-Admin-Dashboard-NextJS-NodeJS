# Electronics eCommerce Shop With Admin Dashboard NextJS NodeJS

# Step-by-step video instructions for running the app

[https://www.youtube.com/watch?v=Ry0aOMws0gE](https://www.youtube.com/watch?v=Ry0aOMws0gE)

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


# Project screenshots

# Home page

![singitronic home page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/a48c092d-1f19-4bae-a480-0b5862630e1c)

# Shop page

![singitronic shop page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/1133effb-0511-40c6-aee5-119404c5af34)

# Single product page

![singitronic single product page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/443ea3e2-4d32-4d15-aa3b-436cbae0eade)

# Register page

![singitronic register page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/0052cc90-d61a-4a8c-b8d8-02cee1b45d13)

# Login page

![singitronic logic page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/7a377bb3-330f-43a4-860f-400bf7aa0f97)

# Search page

![singitronic search page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/384c7f55-16ee-4966-b612-a34f5506af51)

# Wishlist page

![singitronic wishlist page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/a20568d6-12fb-42e6-a5ef-583f6e79229a)

# Cart page

![singitronic cart page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/b9d326be-342c-4f6a-af64-34794f6c39eb)

# Checkout page

![singitronic checkout page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/a458d931-9df2-4e3d-bf3f-702c1a3ba9e9)

# Admin dashboard - All orders page

![singitronic admin orders page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/498b07f4-422c-46c5-b2e4-ed2a93306b7a)

# Admin dashboard - All products page

![singitronic admin products page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/e26822ab-6c7e-4474-9161-288a5bb3476f)

# Admin dashboard - All categories page

![singitronic admin categories page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/9e4a54d7-5bbb-4f1b-bdab-43c1079510e1)

# Admin dashboard - All users page

![singitronic admin users page](https://github.com/Kuzma02/Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS/assets/138793624/e14e8f2c-4377-42fd-b89b-d4868cc11b11)
