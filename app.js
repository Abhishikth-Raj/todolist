const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//database connection
mongoose.connect("mongodb+srv://admin-abhi:test123@cluster0.djeui.mongodb.net/todolistDB", {
  useNewUrlParser: true
})

//data schema
const itemSchema = {
  name: String
}

//data model
const Item = mongoose.model("Item", itemSchema);

const task0 = new Item({
  name: "Welcome to your to do list"
})

const task1 = new Item({
  name: "Hit the + button to add a new task"
})

const task2 = new Item({
  name: "<-- hit this to delete an item"
})


const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

const defaultitems = [task0, task1, task2];

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultitems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("succesfully saved default items to database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newtasks: foundItems,
      });
    }
  })



  // render the list file from the appjs data
  //by using key valuired object.

});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: customListName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create new list
        const list = new List({
          name: customListName,
          items: defaultitems
        })
        list.save();
        res.redirect("/" + customListName)
      } else {
        //show existing list
        res.render("list", {
          listTitle: foundList.name,
          newtasks: foundList.items
        })
      }
    }
  })

})

app.get("/about", (req, res) => {
  res.render("about");
})


//when the request recieved this gets executed
app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newitem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    newitem.save();
    res.redirect("/")
  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => {
      if (err) {
        console.log(err);
      } else {
        foundList.items.push(newitem);
        foundList.save();
        res.redirect("/" + listName);
      }
    })
  }

})

app.post("/delete", (req, res) => {
  const checkedItemId = (req.body.checkbox);
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({
      _id: checkedItemId
    }, (err) => {
      if (err) console.log(err);
      else {
        console.log("deleted the checked item");
        res.redirect("/")
      }
    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }

})



//listen at port 3000
app.listen( process.env.PORT || 3000 , () => {
  console.log("server has started succesfully");
});