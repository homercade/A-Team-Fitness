/**
 * We load the ExpressJS module.
 * More than just a mere framework, it is also a complementary library
 * to itself.
 */
var express = require('express');

/**
 * Having that in mind, this is one of its robust feature, the Router.
 * You'll appreciate this when we hit RESTful API programming.
 * 
 * For more info, read this: https://expressjs.com/en/4x/api.html#router
 */
var router = express.Router();

/**
 * Import the authentication middleware to check for the user object
 * in the session.
 */
var authMiddleware = require('../auth/middlewares/auth');

/**
 * Use the middleware to check all routes registered for this router.
 */
router.use(authMiddleware.hasAuth);

/**
 * If you can notice, there's nothing new here except we're declaring the
 * route using the router, and not using app.use().
 * 
 * We're also importing controllers from the controller directory of this module.
 */
var indexController = require('./controllers/index');
router.get('/', indexController);

router.post('/inventory', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("INSERT INTO tblinventory ( strProdName, strUnit, intBarQty, intStorageQty, fltRetailPrc, intStat) VALUES ( ?, ?, ?, ?, ?, 1) ",[req.body.productname, req.body.uom, req.body.barqty, req.body.strqty, req.body.prc], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
router.post('/inventory/edit', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET strProdName = ?, strUnit = ?, intBarQty = ?, intStorageQty = ?, fltRetailPrc = ? WHERE intProdId = ? ",[req.body.productname, req.body.uom, req.body.barqty, req.body.strqty, req.body.prc, req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/inventory/delete', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET intStat = 0 WHERE intProdId = ?",[req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/inventory/revert', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET intStat = 1 WHERE intProdId = ?",[req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/admin/staffs', (req, res) => {
    var db = require('../../lib/database')();{
        db.query("INSERT INTO tblstaff ( strLname, strFname, strStatus , intStatus ) VALUES ( ?, ?, 'Available', 1 ) ",[req.body.lname, req.body.fname], (err, results, fields)=>{
          if (err)
            console.log(err);
          else{
            res.redirect('/admin/staffs');
          }
          });
        }
    });
    router.post('/admin/staffs/edit', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff  SET strLname = ?, strFname = ?, strStatus = ?  WHERE intStaffId = ? ",[req.body.lname, req.body.fname, req.body.status, req.body.staffid], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
      router.post('/admin/staffs/delete', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff SET intStatus = 0 WHERE intStaffId = ?",[req.body.id], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
      router.post('/admin/staffs/revert', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff  SET intStatus = 1 WHERE intStaffId = ?",[req.body.id], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
function viewInventory(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblinventory ", function (err, results, fields) {
      if (err) return res.send(err);
      console.log(results)
      req.inventory = results;
      return next();
  });
}
function viewStaffs(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblstaff ", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.staffs = results;
        return next();
    });
  }
function viewReports(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblinventory WHERE intStat = 1  ", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.deleted = results;
        return next();
    });
  }
function viewAvailable(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblstaff WHERE strStatus = 'Available'", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.available = results;
        return next();
    });
  }



function logout(req,res){
    res.render('auth/views/login')
}
function inventory(req,res){
    res.render('home/views/inventory', {inventorytab: req.inventory})
}
function orders(req,res){
    res.render('home/views/orders')
}
function deliveries(req,res){
    res.render('home/views/deliveries')
}
function dash(req,res){
    res.render('admin/users/views/dashboard')
}
function reports(req,res){
    res.render('admin/users/views/reports', {reports: req.deleted, available: req.available})
}
router.get('/', logout);
router.get('/inventory', viewInventory, inventory );
router.get('/inventory/edit' , viewInventory, inventory);
router.get('/inventory/delete' , viewInventory, inventory);
router.get('/inventory/revert' , viewInventory, inventory);
router.get('/staff', staff);
router.get('/orders', orders);
router.get('/deliveries' , deliveries);
router.get('/admin/staffs' , viewStaffs, staff);
router.get('/admin/reports' ,viewReports, viewAvailable, reports);
/**
router.get('/admin/staffs/edit' , viewStaffs, staff);
router.get('/admin/staffs/delete' , viewStaffs, staff);
router.get('/admin/staffs/revert' , viewStaffs, staff);**/
router.get("/admin", dash);


//A-TEAM FITNESS FUNCTIONS

// GENERAL
function reports(req,res){
    res.render('admin/general/views/reports');
}
function userd(req,res){
    res.render('admin/general/views/user');
}
function utils(req,res){
    res.render('admin/general/views/utils');
}

// MAINTENANCE
function branch(req,res){
    res.render('admin/maintenance/views/m-branch');
}
function category(req,res){
    res.render('admin/maintenance/views/m-category');
}
function classes(req,res){
    res.render('admin/maintenance/views/m-classes');
}
function discount(req,res){
    res.render('admin/maintenance/views/m-discount');
}
function facility(req,res){
    res.render('admin/maintenance/views/m-facility');
}
function general(req,res){
    res.render('admin/maintenance/views/m-general');
}
function membership(req,res){
    res.render('admin/maintenance/views/m-membership');
}
function program(req,res){
    res.render('admin/maintenance/views/m-program');
}
function specs(req,res){
    res.render('admin/maintenance/views/m-specialization');
}
function staff(req,res){
    res.render('admin/maintenance/views/m-staff');
}
function trainer(req,res){
    res.render('admin/maintenance/views/m-trainer');
}

// TRANSACTIONS

function t_class(req,res){
    res.render('admin/transactions/views/t-classes');
}
function t_event(req,res){
    res.render('admin/transactions/views/t-event');
}
function freezed(req,res){
    res.render('admin/transactions/views/t-freezed');
}
function income(req,res){
    res.render('admin/transactions/views/t-income');
}
function payment(req,res){
    res.render('admin/transactions/views/t-payment');
}
function pending(req,res){
    res.render('admin/transactions/views/t-pending');
}
function personal(req,res){
    res.render('admin/transactions/views/t-personal');
}
function regular(req,res){
    res.render('admin/transactions/views/t-regular');
}
//A-TEAM FITNESS GETS

//GENERAL
router.get('/reports', reports);
router.get('/user', userd);
router.get('/utilities', utils);

//MAINTENANCE
router.get('/branch', branch);
router.get('/category', category);
router.get('/classes', classes );
router.get('/discount', discount);
router.get('/facility', facility);
router.get('/general', general);
router.get('/membership', membership);
router.get('/program', program);
router.get('/specialization', specs);
router.get('/staff', staff);
router.get('/trainer', trainer);

//TRANSACTIONS
router.get('/t-class', t_class);
router.get('/t-event', t_event);
router.get('/freezed', freezed);
router.get('/income', income);
router.get('/payment', payment);
router.get('/pending', pending);
router.get('/personal', personal);
router.get('/regular', regular);
/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;