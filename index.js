const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const Sequelize = require("sequelize");
const db = require('./db').db;
const excel = require('exceljs');

const app = express();

app.use(cors());

app.use(bodyparser.urlencoded({
    extended : true
}));
app.use(bodyparser.json());


//set view engin
app.set('views','./views');
app.set('view engine', 'hbs');

//get all user
app.get('/', (req, res)=>{
    let sql = "SELECT * FROM users";
    db.query(sql, (err, result)=>{
        if (err) {
            console.log(err);
        }

        if (result.length > 0) {
            // res.send({
            //     status: 'success',
            //     data: result
            // })
           
            res.render('index', {
                viewTitle: "Users List",
                user: result
            });
        } else {
            res.render('index',{
                viewTitle: "Users List",
            });
        }
    });
});

//load add page
app.get('/add', (req, res) => {
    res.render('add', {
        viewTitle: "Add New User"
    });
});

//insert new user
app.post('/add-user', (req, res) => {
  let name = req.body.user_name;
  let email = req.body.user_email;
  let mobile = req.body.user_mobile;
    
  let sql = "INSERT INTO `users` (`user_name`, `user_email`, `user_mobile`) VALUES ('"+ name +"', '"+ email +"', '"+ mobile +"')";
  db.query(sql, (err, result)=>{
      if (err) {
          console.log(err,'error: ');
      }
      if (result.affectedRows) {
        res.redirect('/');
      }
  })
});

//load edit page
app.get('/edit/:id', (req, res) => {
    let userId = req.params.id;
    let sql = "SELECT * FROM users WHERE users.id="+ userId;
    db.query(sql, (err, result)=>{
        if (err) {
            console.log(err,'error: ');
        }
        if (result.length > 0) {
           // res.send(result)
            res.render('edit',{
                viewTitle: "Update User",
                user: result[0]
            });
        } 
    });
});

//update user
app.post('/edit-user', (req, res) => {
    let id = req.body.user_id;
    let name = req.body.user_name;
    let email = req.body.user_email;
    let mobile = req.body.user_mobile;
      
    let sql = "UPDATE `users` SET `user_name`='"+name+"',`user_email`='"+email+"', `user_mobile`='"+mobile+"' WHERE id="+ id;
    db.query(sql, (err, result)=>{
        if (err) {
            console.log(err,'error: ');
        }
        if (result.affectedRows) {
          res.redirect('/');
        }
    })
  });

//delete user
app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = "DELETE FROM `users` WHERE `users`.`id` = "+ id;
    db.query(sql, (err, result)=>{
        if (err) {
            console.log(err,'error: ');
        }
        if (result.affectedRows) {
            res.redirect('/');
        }
    })
});

//export excel
app.get('/download-excel', (req, res) => {
    let sql="SELECT * FROM users";
    db.query(sql, (err, result) => {
        const jsonUsers = JSON.parse(JSON.stringify(result));

		let workbook = new excel.Workbook(); //creating workbook
		let worksheet = workbook.addWorksheet('Users'); //creating worksheet

        //  WorkSheet Header
		worksheet.columns = [
			{ header: 'Id', key: 'id', width: 10 },
			{ header: 'Name', key: 'user_name', width: 30 },
			{ header: 'Email', key: 'user_email', width: 30},
			{ header: 'Mobile', key: 'user_mobile', width: 10, outlineLevel: 1}
		];

        // Add Array Rows
		worksheet.addRows(jsonUsers);

        // Write to File
		// workbook.xlsx.writeFile("customer.xlsx")
		// .then(function() {
		// 	console.log("file saved!");
		// });
       let timestamp = new Date().getTime().toString();
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "user-"+timestamp+".xlsx"
          );
	 
		// Write to File
		return workbook.xlsx.write(res)
		.then(function() {
			console.log("file saved!");
            res.status(200).end();
		});
    });
});

app.listen(3000, ()=>{
    console.log("Server is running...");
})