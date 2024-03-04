import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
  const dividerLocation = request.url.indexOf("?");
  let filterObj: any = {};
  let sortObj = {};
  let sortByValue: string = "defaultSort";
  if (dividerLocation !== -1) {
    // queryArray sada sadrzi ceo query deo sto ukljucuje filter i sort queryije
    const queryArray = request.url
      .substring(dividerLocation + 1, request.url.length)
      .split("&");

    let filterType;
    let filterArray = [];

    for (let i = 0; i < queryArray.length; i++) {
      // proveravam da li je u pitanju filter mod i price sort
      if (
        queryArray[i].indexOf("filters") !== -1 &&
        queryArray[i].indexOf("price") !== -1
      ) {
        // uzimam "price" deo. Naravno mogao sam samo da napisem filterType="price"
        filterType = queryArray[i].substring(
          queryArray[i].indexOf("price"),
          queryArray[i].indexOf("price") + "price".length
        );
      }
      // proveravam da li je u pitanju filter mod i rating sort
      if (
        queryArray[i].indexOf("filters") !== -1 &&
        queryArray[i].indexOf("rating") !== -1
      ) {
        // uzimam "rating" deo. Naravno mogao sam samo da napisem filterType="rating"
        filterType = queryArray[i].substring(
          queryArray[i].indexOf("rating"),
          queryArray[i].indexOf("rating") + "rating".length
        );
      }

      if (queryArray[i].indexOf("sort") !== -1) {
        // uzimamo vrednost sorta iz querija
        sortByValue = queryArray[i].substring(queryArray[i].indexOf("=") + 1);
        console.log("Sort in if: " + sortByValue);
        console.log("qA: " + queryArray[i]);
        
        
      }

      if (queryArray[i].indexOf("filters") !== -1) {
        // uzimam value deo. To je deo gde se nalazi int vrednost querija i konvertujem je u broj jer je po defaultu string
        const filterValue = parseInt(
          queryArray[i].substring(
            queryArray[i].indexOf("=") + 1,
            queryArray[i].length
          )
        );

        // uzimam operator npr. lte, gte, gt, lt...
        const filterOperator = queryArray[i].substring(
          queryArray[i].indexOf("$") + 1,
          queryArray[i].indexOf("$") + 4
        );

        // sve to dodajemo u filterArray
        // primer izgleda filterArray:
        /*
        [
        { filterType: 'price', filterOperator: 'lte', filterValue: 3000 },
        { filterType: 'rating', filterOperator: 'gte', filterValue: 0 }
        ]
        */
        filterArray.push({ filterType, filterOperator, filterValue });
      }
    }

    for (let item in filterArray) {
      filterObj = {
        ...filterObj,
        [filterArray[item].filterType + ""]: {
          [filterArray[item].filterOperator]: filterArray[item].filterValue,
        },
      };
    }
  }

  console.log(filterObj);
  

  if (sortByValue === "defaultSort") {
    sortObj = [];
  } else if (sortByValue === "titleAsc") {
    sortObj = [
      {
        title: "asc",
      },
    ];
  } else if (sortByValue === "titleDesc") {
    sortObj = [
      {
        title: "desc",
      },
    ];
  } else if (sortByValue === "lowPrice") {
    sortObj = [
      {
        price: "asc",
      },
    ];
  } else if (sortByValue === "highPrice") {
    sortObj = [
      {
        price: "desc",
      },
    ];
  }

  console.log("Sort by: " + sortByValue);
  console.log(sortObj);

  let users;
  if (Object.keys(filterObj).length === 0) {
    users = await prisma.product.findMany({});
  } else {
    users = await prisma.product.findMany<object>({
      where: filterObj,
      orderBy: sortObj,
    });
  }
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
