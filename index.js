let express = require("express");

let app = express();

let {open} = require("sqlite")

let sqlite3 = require("sqlite3");

let path = require("path");

let cors = require("cors");

app.use(cors());

app.use(express.json());



let database = null;

let dbPath = path.join(__dirname, "userblog.db");


let inDataBase= async ()=>{

    try{
        database = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, ()=>{
            console.log("Server is running on port 3000");
        });
    }
    catch(error){
        console.log(`Db connection error: ${error.message}`);
        process.exit(1);
    }
    
}

inDataBase();


app.post("/blogs", (request,response)=>{

    const fetchAndInsert = async()=>{

        const response=await fetch("https://faux-api.com/api/v1/lucidblogs_3939708446859056");

        console.log(response);

        if(response.ok===true){

        const data = await response.json();
      

        for (let item of data.result) {
            console.log(item)

           const inserting=`INSERT INTO userblogtable(id,date,title,author,comments,description,image)
           VALUES(${item.id},'${item.date}','${item.title}','${item.author}','${item.comments}','${item.description}','${item.image}');`;
             
               await database.run(inserting);
        }

    }
}

    fetchAndInsert();
})



app.get("/blogsAll",async(request,response)=>{

    const dataFromTable=`SELECT * FROM userblogtable`;
    const dataFromTalbeAll=await database.all(dataFromTable);
    response.send(dataFromTalbeAll);
})