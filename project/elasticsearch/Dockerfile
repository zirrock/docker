FROM docker.elastic.co/elasticsearch/elasticsearch:7.5.1
RUN bin/elasticsearch-plugin install analysis-icu

COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY config/elasticsearch.yml config/elasticsearch.yml
COPY config/setup.sh config/setup.sh
RUN mkdir utils
COPY utils/wait-for-it.sh utils/wait-for-it.sh

USER root
RUN chmod +x /docker-entrypoint.sh utils/wait-for-it.sh config/setup.sh
RUN chown -R elasticsearch:elasticsearch /docker-entrypoint.sh utils/wait-for-it.sh config/setup.sh

USER elasticsearch
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/share/elasticsearch/bin/elasticsearch"]
