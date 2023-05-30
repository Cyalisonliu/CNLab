const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
	host : 'localhost',
	user : 'rootAlison',
	password : '00000000',
    database: 'labdb',
});

// test if we connect to mysql
db.connect(function(err) {
    if (err) throw err;
    db.query("show tables", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});

app.listen(port, () => {
	console.log(`server listening at http://localhost:${port}`)
})

// -- Set user's password
// INSERT INTO radcheck (username, attribute, op, value)
// VALUES ('<username>', 'Cleartext-Password', ':=', '<password>');
// -- Set user's time limit
// INSERT INTO radcheck (username, attribute, op, value)
// VALUES ('<username>', 'Expire-After', ':=', '<time limit in seconds>');
// -- Set user's data limit
// INSERT INTO radcheck (username, attribute, op, value)
// VALUES ('<username>', 'Max-Bytes', ':=', '<data limit>');
app.post('/insertRadcheck', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // const limitTraffic = req.body.limitTraffic;
    const limitTime = req.body.limitTime;
    db.query(
        `INSERT INTO radcheck (username, attribute, op, value) VALUES \
        ('${username}', 'Cleartext-Password', ':=', '${password}'), \
        ('${username}', 'Expire-After', ':=', '${limitTime}') \
        `, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("User inserted.");
            }
        }
    )
});
// -- Add user
// INSERT INTO radusergroup (username, groupname)
// VALUES ('<username>', 'user');
app.post('/insertRaduse', (req, res) => {
    const username = req.body.username;
    db.query(
        `INSERT INTO radusergroup (username, groupname) VALUES ('${username}', 'user')`
        , (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("User inserted.");
            }
        }
    )
});

app.post('/insertUerinfo', (req, res) => {
    const username = req.body.username;
    const template = req.body.template;
    db.query(
        `INSERT INTO userinfo (username, template_id) VALUES ('${username}', '${template}')`
        , (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("User inserted.");
            }
        }
    )
});


// Get all user in database
app.get('/users', (req, res) => {
    db.query("SELECT * FROM radcheck", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/managers', (req, res) => {
    db.query("SELECT * FROM managerinfo", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

// -- Get total bytes transmitted
// SELECT IFNULL(SUM(acctinputoctets) + SUM(acctoutputoctets), 0)
// FROM radacct
// WHERE username = '<username>';
// app.get('/traffic', (req, res) => {
//     const username = req.query.username;
//     db.query(
//         `SELECT IFNULL( SUM(acctinputoctets) + SUM(acctoutputoctets),0) \
//         FROM radacct \
//         WHERE username = '${username}'`,
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.send(result);
//             }
//     })
// })

// -- Get total time (in seconds) used
// SELECT SUM(total_time)
// FROM (
//     SELECT IFNULL(SUM(acctsessiontime), 0) AS total_time
//     FROM radacct
//     WHERE username = '<username>'
//     UNION
//     SELECT IFNULL(MAX(TIME_TO_SEC(TIMEDIFF(NOW(), acctstarttime))), 0) as total_time
//     FROM radacct
//     WHERE username = '<username>' AND acctstoptime IS NULL
// ) AS t;
app.get('/time', (req, res) => {
    const username = req.query.username;

    db.query(
        `SELECT SUM(total_time)
        FROM (
            SELECT IFNULL(SUM(acctsessiontime), 0) AS total_time
            FROM radacct
            WHERE username = '${username}'
            UNION
            SELECT IFNULL(MAX(TIME_TO_SEC(TIMEDIFF(NOW(), acctstarttime))), 0) as total_time
            FROM radacct
            WHERE username = '${username}' AND acctstoptime IS NULL
        ) AS t;`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

// get questions template id
app.get('/questions', (req, res) => {
    const username = req.query.username;

    db.query(
        `SELECT template_id FROM userinfo WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

app.get('/addtime', (req, res) => {
    const username = req.query.username;

    db.query(
        `SELECT add_time FROM userinfo WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

// -- Update user's data limit
// UPDATE radcheck
// SET value = '<new data limit>'
// WHERE username = '<username>' AND attribute = 'Max-Bytes';
// app.put('/update/traffic', (req, res) => {
//     const username = req.body.username;
//     const limitTraffic = req.body.limitTraffic;
//     db.query(
//         `UPDATE radcheck \
//         SET value = '${limitTraffic}' \
//         WHERE username = '${username}' AND attribute = 'Max-Bytes'`,
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.send(result);
//             }
//     })
// })

// -- Update user's data limit
// UPDATE radcheck
// SET value = '<new time limit>'
// WHERE username = '<username>' AND attribute = 'Expire-After';
app.put('/update/time', (req, res) => {
    const username = req.body.username;
    const limitTime = req.body.limitTime;
    db.query(
        `UPDATE radcheck \
        SET value = '${limitTime}' \
        WHERE username = '${username}' AND attribute = 'Expire-After'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

app.put('/update/question', (req, res) => {
    const username = req.body.username;
    const curtemplate = req.body.curtemplate;
    db.query(
        `UPDATE userinfo \
        SET template_id = ${curtemplate} \
        WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

app.put('/update/addtime', (req, res) => {
    const username = req.body.username;
    const curAddtime = req.body.curAddtime;
    console.log(req);
    db.query(
        `UPDATE userinfo \
        SET add_time = '${curAddtime}' \
        WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

app.put('/update/manager/template', (req, res) => {
    const username = req.body.username;
    const curtemplate = req.body.curtemplate;
    db.query(
        `UPDATE managerinfo \
        SET template_id = '${curtemplate}'\
        WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})
app.put('/update/manager/addtime', (req, res) => {
    const username = req.body.username;
    const curAddtime = req.body.curAddtime;
    db.query(
        `UPDATE managerinfo \
        SET add_time = '${curAddtime}'\
        WHERE username = '${username}'`,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
    })
})

app.delete('/delete/RadcheckUser/:username', (req, res) => {
    const username = req.params.username;
    db.query("DELETE FROM radcheck WHERE username = ?", username, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
app.delete('/delete/RaduseUser/:username', (req, res) => {
    const username = req.params.username;
    db.query("DELETE FROM radusergroup WHERE username = ?", username, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})
