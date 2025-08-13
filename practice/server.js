const express = require('express');
const app =express();

const session = require('express-session')


app.use(session(
    {
        secret:'mysupersecretcode'
    }
));

app.get('/',(req,res)=>{
    res.send('Hello World');
});



app.listen(3000,()=>{
    console.log('server is running on port 3000');
});