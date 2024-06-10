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


app.post("/blogAdd",async(request,response)=>{

    const blogAdding=request.body 


    const {id,date,title,author,comments,description,image}=blogAdding

    const inserting=`INSERT INTO userblogtable(id,date,title,author,comments,description,image)
    VALUES(${id},'${date}','${title}','${author}','${comments}','${description}','${image}');`;
      
    await database.run(inserting);
    
    response.send("blog added");
    

})

app.delete("/blogDelete/:id",async(request,response)=>{

    const {id}=request.params;
    const deleting=`DELETE FROM userblogtable WHERE id=${id}`;
    await database.run(deleting);
 
    response.send("blog deleted");


}
)


app.put("/blogUpdate/:id",async(request,response)=>{

    const {id}=request.params;
    const blogUpdating=request.body;
    const {date,title,author,comments,description,image}=blogUpdating;
    const updating=`UPDATE userblogtable SET date='${date}',title='${title}',author='${author}',comments='${comments}',description='${description}',image='${image}' WHERE id=${id}`;
    
    await database.run(updating);
    response.send("blog updated");
})