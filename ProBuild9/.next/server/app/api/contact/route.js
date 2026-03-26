"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},27828:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>g,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s={};t.r(s),t.d(s,{POST:()=>l});var i=t(49303),o=t(88716),a=t(60670),n=t(87070),p=t(55245);async function l(e){try{let{name:r,company:t,email:s,phone:i,topic:o,message:a}=await e.json();if(!r||!s||!a)return n.NextResponse.json({error:"İsim, e-posta ve mesaj alanları zorunludur."},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))return n.NextResponse.json({error:"Ge\xe7erli bir e-posta adresi giriniz."},{status:400});let l=p.createTransport({host:process.env.SMTP_HOST||"mail.joinpr.com.tr",port:parseInt(process.env.SMTP_PORT||"465"),secure:!0,auth:{user:process.env.SMTP_USER||"sezai@joinpr.com.tr",pass:process.env.SMTP_PASSWORD||""},tls:{rejectUnauthorized:!1}}),u={from:process.env.SMTP_FROM||process.env.SMTP_USER||"noreply@joinpr.com.tr",to:process.env.CONTACT_EMAIL||"sezai@joinpr.com.tr",subject:`İletişim Formu: ${o||"Genel İletişim"}`,html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Yeni İletişim Formu Mesajı</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>İsim:</strong> ${r}</p>
            <p><strong>Şirket:</strong> ${t||"Belirtilmemiş"}</p>
            <p><strong>E-posta:</strong> <a href="mailto:${s}">${s}</a></p>
            <p><strong>Telefon:</strong> ${i||"Belirtilmemiş"}</p>
            <p><strong>Konu:</strong> ${o||"Belirtilmemiş"}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #0ea5e9;">Mesaj:</h3>
            <p style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${a}</p>
          </div>
        </div>
      `,replyTo:s};await l.sendMail(u);let c=r.split(" ")[0]||r,d=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        </div>
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
          <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Merhaba ${c},</h2>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Talebinizi aldık. Ekibimiz en kısa s\xfcrede sizinle iletişime ge\xe7ecektir.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0;">
            Saygılarımızla,<br><strong>Join PR Destek Ekibi</strong>
          </p>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
          \xa9 ${new Date().getFullYear()} Join PR. T\xfcm hakları saklıdır.
        </p>
      </div>
    `;return await l.sendMail({from:`Join PR Destek <${process.env.SMTP_FROM||process.env.SMTP_USER||"noreply@joinpr.com.tr"}>`,to:s,subject:"Talebiniz Alındı | Join PR",html:d,replyTo:process.env.CONTACT_EMAIL||"sezai@joinpr.com.tr"}),n.NextResponse.json({success:!0,message:"Mesajınız başarıyla g\xf6nderildi."},{status:200})}catch(e){return console.error("Mail g\xf6nderme hatası:",e),n.NextResponse.json({error:"Mail g\xf6nderilirken bir hata oluştu. L\xfctfen daha sonra tekrar deneyin."},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"/Users/sezaidemirer/Desktop/Join Pr Site/src/app/api/contact/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:c,staticGenerationAsyncStorage:d,serverHooks:m}=u,x="/api/contact/route";function g(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[8948,5972,9349],()=>t(27828));module.exports=s})();