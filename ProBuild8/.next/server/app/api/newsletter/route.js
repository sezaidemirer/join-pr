"use strict";(()=>{var e={};e.id=5497,e.ids=[5497],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},68903:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>g,staticGenerationAsyncStorage:()=>f});var i={};r.r(i),r.d(i,{POST:()=>x});var o=r(49303),s=r(88716),n=r(60670),a=r(87070),p=r(55245);let l=process.env.SMTP_FROM||process.env.SMTP_USER||"noreply@joinpr.com.tr",u={subject:"B\xfcltene Hoş Geldiniz! | Join PR",html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">B\xfcltene Hoş Geldiniz!</p>
      </div>
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
        <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Merhaba,</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Join PR b\xfcltenine abone olduğunuz i\xe7in teşekk\xfcr ederiz! Artık ekosistemimizden se\xe7ilmiş i\xe7g\xf6r\xfcler, projeler ve fırsatlar doğrudan e-posta kutunuza gelecek.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          Bizi takip etmeye devam edin — en son haberler ve kampanyalardan ilk siz haberdar olacaksınız.
        </p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        \xa9 ${new Date().getFullYear()} Join PR. T\xfcm hakları saklıdır.
      </p>
    </div>
  `},d={subject:"Welcome to the Newsletter! | Join PR",html:`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0d9488; font-size: 28px; margin: 0;">Join PR</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Welcome to the Newsletter!</p>
      </div>
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; color: #e2e8f0;">
        <h2 style="color: #fff; font-size: 22px; margin: 0 0 16px 0;">Hello,</h2>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Thank you for subscribing to the Join PR newsletter! You will now receive curated insights, projects and opportunities from our ecosystem directly to your inbox.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          Stay tuned — you'll be the first to know about our latest news and campaigns.
        </p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
        \xa9 ${new Date().getFullYear()} Join PR. All rights reserved.
      </p>
    </div>
  `};async function x(e){try{let{email:t,locale:r="tr"}=await e.json();if(!t)return a.NextResponse.json({error:"E-posta adresi zorunludur."},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))return a.NextResponse.json({error:"Ge\xe7erli bir e-posta adresi giriniz."},{status:400});let i=p.createTransport({host:process.env.SMTP_HOST||"mail.joinpr.com.tr",port:parseInt(process.env.SMTP_PORT||"465"),secure:!0,auth:{user:process.env.SMTP_USER||"sezai@joinpr.com.tr",pass:process.env.SMTP_PASSWORD||""},tls:{rejectUnauthorized:!1}}),o="en"===r?d:u;return await i.sendMail({from:`Join PR B\xfclten <${l}>`,to:"sezai@joinpr.com.tr",subject:`Yeni B\xfclten Aboneliği: ${t}`,html:`
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #0ea5e9;">Yeni B\xfclten Aboneliği</h2>
          <div style="background:#f9fafb;padding:20px;border-radius:8px;">
            <p><strong>E-posta:</strong> <a href="mailto:${t}">${t}</a></p>
            <p><strong>Tarih:</strong> ${new Date().toLocaleString("tr-TR")}</p>
          </div>
        </div>
      `}),await i.sendMail({from:`Join PR <${l}>`,to:t,subject:o.subject,html:o.html}),a.NextResponse.json({success:!0,message:"B\xfcltene başarıyla abone oldunuz."},{status:200})}catch(e){return console.error("B\xfclten abonelik hatası:",e),a.NextResponse.json({error:"Bir hata oluştu. L\xfctfen daha sonra tekrar deneyin."},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/newsletter/route",pathname:"/api/newsletter",filename:"route",bundlePath:"app/api/newsletter/route"},resolvedPagePath:"/Users/sezaidemirer/Desktop/Join Pr Site/src/app/api/newsletter/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:m,staticGenerationAsyncStorage:f,serverHooks:g}=c,h="/api/newsletter/route";function y(){return(0,n.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[8948,5972,9349],()=>r(68903));module.exports=i})();