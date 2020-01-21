vcl 4.0;
import std;
import directors;
import cookie;
import header;

backend s1 {
  .host = "project_front_1";
  .port = "8080";
}

backend s2 {
  .host = "project_front_2";
  .port = "8081";
}

sub vcl_init {
  new cdir = directors.hash();
  cdir.add_backend(s1,1);
  cdir.add_backend(s2,1);
}

sub vcl_recv {
  cookie.parse(req.http.cookie);
  if(cookie.get("sticky")) {
    set req.http.sticky = cookie.get("sticky");
  } else {
    set req.http.sticky = std.random(1, 100);
  }
  set req.backend_hint = cdir.backend(req.http.sticky);
}

sub vcl_deliver {
  if (req.http.sticky) {
    header.append(resp.http.Set-Cookie, "sticky=bar" + req.http + ";	Expires=" + cookie.format_rfc1123(now, 60m));
  }
}
