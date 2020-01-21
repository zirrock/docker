vcl 4.0;

import std;
import directors;

backend s1 {
  .host = "project_dates_1";
  .port = "5003";
}

backend s2 {
  .host = "project_dates_2";
  .port = "5003";
}

sub vcl_init {
  new cdir = directors.hash();
  cdir.add_backend(s1,1);
  cdir.add_backend(s2,1);
}
