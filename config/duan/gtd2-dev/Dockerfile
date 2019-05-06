FROM leonxi/cordova-ionic3-browser
MAINTAINER leon_xi@163.com

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER root
WORKDIR /

ENTRYPOINT ["/entrypoint.sh"]
