export default async (request) => {
  if (request.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}), {status:405, headers:{"content-type":"application/json"}});
  try {
    const body = await request.json();
    if (!body.url || !Array.isArray(body.emojis) || !body.emojis.length) return new Response(JSON.stringify({error:"url dan emojis wajib diisi"}), {status:400,headers:{"content-type":"application/json"}});
    const key = Netlify.env.get("NETLIFY_BOTWA_API_KEY");
    if (!key) return new Response(JSON.stringify({error:"NETLIFY_BOTWA_API_KEY belum dikonfigurasi"}), {status:500,headers:{"content-type":"application/json"}});
    const endpoint = body.endpoint === "paid" ? "/api/react" : "/api/react/free";
    const upstream = await fetch("https://react.botwa.net" + endpoint, {
      method:"POST",
      headers:{"x-api-key":key,"content-type":"application/json"},
      body:JSON.stringify({url:body.url, emojis:body.emojis})
    });
    const text = await upstream.text();
    return new Response(text,{status:upstream.status,headers:{"content-type":upstream.headers.get("content-type") || "application/json"}});
  } catch(e) { return new Response(JSON.stringify({error:e.message}),{status:500,headers:{"content-type":"application/json"}}); }
};
