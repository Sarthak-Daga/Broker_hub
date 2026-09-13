import { db } from "../prisma/db";

async function main() {
  // const client = await db.orm.public.Client.createAll([
  //   { name: "Sarthak", address: "Here", mobileNumber: "9425890911" },
  //   { name: "Hello", address: "Here", mobileNumber: "9425890911" },
  //   { name: "Ragahv", address: "Here", mobileNumber: "9425890911" },
  //   { name: "Naman", address: "Here", mobileNumber: "9425890911" },
  // ]);

  const users = await db.orm.public.Client.select("id", "name").all();
  console.log(users);
const deleteClient = await db.orm.public.Client
  .deleteAll();

  const user = await db.orm.public.Client.select("id", "name").all();
  console.log(user);

  await db.close();
  // 
}


main().catch((error) => {
  console.error(error);
  process.exit(1);
});
