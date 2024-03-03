import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const dividerLocation = request.url.indexOf("?");
  const queryArray = request.url
    .substring(dividerLocation + 1, request.url.length)
    .split("&");

  let filterType;
  let filterArray = [];

  for (let i = 0; i < queryArray.length; i++) {
    if (queryArray[i].indexOf("price") !== -1) {
      filterType = queryArray[i].substring(
        queryArray[i].indexOf("price"),
        queryArray[i].indexOf("price") + "price".length
      );
    }

    const filterValue = parseInt(
      queryArray[i].substring(
        queryArray[i].indexOf("=") + 1,
        queryArray[i].length
      )
    );

    const filterOperator = queryArray[i].substring(
      queryArray[i].indexOf("$") + 1,
      queryArray[i].indexOf("$") + 4
    );

    filterArray.push({ filterType, filterOperator, filterValue });
  }

  let filterObj = {};
  for (let item in filterArray) {
    filterObj = {
      [filterArray[item].filterType + ""]: {
        [filterArray[0].filterOperator]: filterArray[0].filterValue,
      },
    };
  }

  const users = await prisma.product.findMany<object>({
    where: filterObj,
  });
  return NextResponse.json(users);
}

/*

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filters } = req.query;

    // Handle the filters and perform necessary operations
    const priceFilter = filters?.price;
    const maxPrice = parseInt(priceFilter.$lte, 10) || 1000;

    // You can use the maxPrice in your database query or any other logic
    // For demonstration purposes, let's just send back a response
    const products = [
      { id: 1, name: 'Product 1', price: 500 },
      { id: 2, name: 'Product 2', price: 800 },
      // Add more products as needed
    ];

    const filteredProducts = products.filter(product => product.price <= maxPrice);

    res.status(200).json({ products: filteredProducts });
  } else {
    // Handle other HTTP methods if needed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

*/

/*
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};
--------------------------------------------------
*/

// export async function POST(request:NextRequest){
//     const body = await request.json();
//   const validation = schema.safeParse(body);

//     if(!validation.success){
//         return NextResponse.json(validation.error.errors, { status: 400 })
//     }

//     const user = await prisma.user.findUnique({
//       where: {email: body.email}
//     })

//     if(user){
//       return NextResponse.json({error: 'User already exists'}, {status: 400})
//     }

//     const newUser = await prisma.user.create({
//       data: {
//         name: body.name,
//         email: body.email
//       }
//     });

//     return NextResponse.json(newUser, {status: 201});
// }
