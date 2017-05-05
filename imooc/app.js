var express=require("express");
var path=require("path");
var mongoose=require("mongoose");
var _=require("underscore");
var bodyParser=require("body-parser");

var Movie=require("./models/movie");
var port=process.env.PORT||3000;
var app=express();

mongoose.Promise = global.Promise;  
mongoose.connect("mongodb://localhost/longrui");

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.set("views","./views/page");
app.set("view engine","jade");

app.locals.monent=require("moment");
app.listen(port);
console.log('imooc start in port'+port);

//index page 
app.get("/",function(req,res){
	Movie.fetch(function(err,movies){
       if(err){
       	console.log(err);
       }
       res.render("index",{
		title:"首页",
		movie:movies
	   });
	});
	
});

//detail page
app.get("/movie/:id",function(req,res){
    var id=req.params.id;
      Movie.findById(id,function(err,movie){
        res.render("detail",{
  		title:"详细页"+movie.title,
  		movie:movie
	  });
    })
});
//admin update movie
app.get("/admin/update/:id",function(req,res){
   var id=req.params.id;
   if(id){
   	Movie.findById(id,function(err,movie){
       res.render("admin",{
       	title:"更新页",
       	movie:movie
       });
   	})
   }
});


//admin post movie
app.post('/admin/movie/new',function(req,res){
   var id=req.body.movie._id;
   var movieObject=req.body.movie;
   var _movie
   if(id!="undefined"){
   	Movie.findById(id,function(err,movie){
     if(err){
     	console.log(err);
     }
     _movie=_.extend(movie,movieObject);
     _movie.save(function(err,movie){
         if(err){
         	console.log(err);
         }
         res.redirect("/movie/"+movie._id);
     });
   	});
   }else{
   	_movie=new Movie({
   		doctor:movieObject.doctor,
		title:movieObject.title,
		country:movieObject.country,
		language:movieObject.language,
		year:movieObject.year,
    poster:movieObject.poster,
    summary:movieObject.summary,
    flash:movieObject.flash,
   	})
   	_movie.save(function(err,movie){
   		if(err){
   			console.log("err");
   		}
   	    res.redirect("/movie/"+movie._id);
   	});
   }

});

//admin page
app.get("/admin/movie",function(req,res){
	 res.render('admin', {
        title: 'i_movie 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

//list page
app.get("/admin/list",function(req,res){

	Movie.fetch(function(err,movies){
       if(err){
       	console.log(err);
       }
      res.render("list",{
	    	title:"表单页",
        movies:movies
	   })
	})

 });
//list delete
app.delete("/admin/list/:id",function(req,res){
    var id=req.params.id;
    if(id){
      Movie.remove({_id:id},function(err,movie){
            if(err){
              console.log(err);
            }else{
              res.json({success:1});
            }

      });
    }
});


