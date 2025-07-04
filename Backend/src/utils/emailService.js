import nodemailer from "nodemailer"

const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});


const sendEmail=async({to,subject,text,html})=>{
    const info=await transport.sendMail({
        from:`"Support Team" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    console.log("Email sent:",info.messageId);
    
};

export default sendEmail