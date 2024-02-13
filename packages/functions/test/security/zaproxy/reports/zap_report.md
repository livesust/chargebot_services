# ZAP Scanning Report


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 4 |
| Informational | 8 |




## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| A Server Error response code was returned by the server | Low | 1 |
| Application Error Disclosure | Low | 1 |
| Information Disclosure - Debug Error Messages | Low | 1 |
| Strict-Transport-Security Header Not Set | Low | 1 |
| A Client Error response code was returned by the server | Informational | 327 |
| Base64 Disclosure | Informational | 1 |
| Non-Storable Content | Informational | 12 |
| Re-examine Cache-control Directives | Informational | 7 |
| Sec-Fetch-Dest Header is Missing | Informational | 3 |
| Sec-Fetch-Mode Header is Missing | Informational | 3 |
| Sec-Fetch-Site Header is Missing | Informational | 3 |
| Sec-Fetch-User Header is Missing | Informational | 3 |




## Alert Detail



### [ A Server Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Low (High)

### Description

A response code of 500 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 500`
  * Other Info: ``

Instances: 1

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Application Error Disclosure ](https://www.zaproxy.org/docs/alerts/90022/)



##### Low (Medium)

### Description

This page contains an error/warning message that may disclose sensitive information like the location of the file that produced the unhandled exception. This information can be used to launch further attacks against the web application. The alert could be a false positive if the error message is found inside a documentation page.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 500 Internal Server Error`
  * Other Info: ``

Instances: 1

### Solution

Review the source code of this page. Implement custom error pages. Consider implementing a mechanism to provide a unique error reference/identifier to the client (browser) while logging the details on the server side and not exposing them to the user.

### Reference



#### CWE Id: [ 200 ](https://cwe.mitre.org/data/definitions/200.html)


#### WASC Id: 13

#### Source ID: 3

### [ Information Disclosure - Debug Error Messages ](https://www.zaproxy.org/docs/alerts/10023/)



##### Low (Medium)

### Description

The response appeared to contain common error messages returned by platforms such as ASP.NET, and Web-servers such as IIS and Apache. You can configure the list of common debug messages.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Internal Server Error`
  * Other Info: ``

Instances: 1

### Solution

Disable debugging messages before pushing to production.

### Reference



#### CWE Id: [ 200 ](https://cwe.mitre.org/data/definitions/200.html)


#### WASC Id: 13

#### Source ID: 3

### [ Strict-Transport-Security Header Not Set ](https://www.zaproxy.org/docs/alerts/10035/)



##### Low (High)

### Description

HTTP Strict Transport Security (HSTS) is a web security policy mechanism whereby a web server declares that complying user agents (such as a web browser) are to interact with it using only secure HTTPS connections (i.e. HTTP layered over TLS/SSL). HSTS is an IETF standards track protocol and is specified in RFC 6797.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 1

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to enforce Strict-Transport-Security.

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)
* [ https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security ](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
* [ https://caniuse.com/stricttransportsecurity ](https://caniuse.com/stricttransportsecurity)
* [ https://datatracker.ietf.org/doc/html/rfc6797 ](https://datatracker.ietf.org/doc/html/rfc6797)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 15

#### Source ID: 3

### [ A Client Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Informational (High)

### Description

A response code of 400 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id/
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id/
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/._darcs
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.bzr
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.DS_Store
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.git/config
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.hg
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.idea/WebServers.xml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.php_cs.cache
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.ssh/id_dsa
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.ssh/id_rsa
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.svn/entries
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/.svn/wc.db
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/6534704825792213204
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/_framework/blazor.boot.json
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/_wpeprivate/config.json
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/adminer.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/app/etc/local.xml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/BitKeeper
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/7620400868827447387
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/assigned/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/952781804230086734
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/6470000680041571715
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/actuator/health
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/503455956392738910
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/1108089074047261891
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/5138821355435613867
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/1742706485213616770
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/4798720856670951381
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/6337418242739349917
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/7956478747894810665
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/7013291418490036082
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/3234497701310333983
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/outlet_id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/outlet_id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/4301009569187222175
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/encrypted/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/8617590390645286860
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/231548104041967660
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/date
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/date/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/3701283069816716744
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/212866837391349135
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/649050882748847904
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/337020591092693135
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/8938416178275875968
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/1719020935879601947
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/1848905255122849825
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/3404179786187853692
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/to/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/totals/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/2596619385306142696
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/outlets
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/outlets/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/id/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/CHANGELOG.txt
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/composer.json
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/composer.lock
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/config/database.yml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/config/databases.yml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/core
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/1418466322105073401
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/search%3Faaa=bbb
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/search%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/CVS/root
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/DEADJOE
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/elmah.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/4876503045401154540
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/8358638828763729416
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/customer_id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/customer_id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/customer/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/4576207182304175864
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/6089238828676276779
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet%3Fclass.module.classLoader.DefaultAssertionStatus=nonsense
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/filezilla.xml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/i.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/id_dsa
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/id_rsa
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/info.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/key.pem
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/lfm.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/myserver.key
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/phpinfo.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/privatekey.key
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/server-info
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/server-status
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/server.key
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/sftp-config.json
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/sitemanager.xml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/sites/default/files/.ht.sqlite
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/sites/default/private/files/backup_migrate/scheduled/test.txt
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/test.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/3637981438893569961
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/.env
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/.htaccess
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/566625180128158051
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/profile
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/profile/
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/trace.axd
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/vb_test.php
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/vim_settings.xml
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/winscp.ini
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/WS_FTP.ini
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id/
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/profile
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/profile/
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/assigned
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/encrypted
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/control/encrypted/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/encrypted
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/day
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/days_info/from/from/to
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/interval/from/from/to
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/totals
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/search
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/search/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/latest/meta-data/
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 403`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 406`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/photo
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 400`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user/user_id/photo/
  * Method: `PUT`
  * Parameter: ``
  * Attack: ``
  * Evidence: `HTTP/1.1 404`
  * Other Info: ``

Instances: 327

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/encrypted
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2mdk2f+NgFXdncJM180DTmjtx/ZP5vNPe9geFYT5485cs5FtiZZuXlN8kj0EMLidOasIUVFtPpZC+9t2CfTpDNTYV7e1IS3Ao05w5POkUlSAw3BNJrUI5po9tnhYNe6NqzOyl1aa374iF/NHXdQL6zr+O3lrgeq8BaBtkkyJPDZLoTYSqcHeBQTo03aCSGsrgySRtKUgaPJh6GLRo4lXkhyyAfXF6OSd0LeI/+fXpc2u6bGcUMqUdlgQdnTRvem4L2Dz0hY34j9F4wJZknzMiCZ+IKpOgCA+w2Cm7ZFnudM9ukw7bYc5pxACVoyWk8O6Kj7BSGQQKngGY8RQMR/aPJMxqBRa5obhtRkSfeWBEU0v5XLslCvsK0wUMOB73n++LgZ7TQ+4MpS3p1P+Vx2f4plEHuiL3z4Ie6npaKbGprKSaHBpIv7aLWk7rfed10xYgad4HwR5dSKJMJ0d5DR60g==`
  * Other Info: `�gd����Uݝ�L��Nh���O��O{�����\��m��n^S|�=0��9�QQm>�B��v	����W��!-��Np��RT��pM&��=�xX53��V�߾"�G]��:�;yk���m�L�<6K�6�����v�Hk+�$��� h�a�bѣ�W������з���ץͮ鱜PʔvXvtѽ�/`��7�?E�Y�|̈&~ �N� >�`��g��=�L;m�9�V���ú*>�Hd*xc�P1�<�1�Z��}�M/�r�+�+L0�{��.{M�2���S�W��D��>{��h�Ʀ��hpi"��-i;����LX��xyu"�0��4z�`

Instances: 1

### Solution

Manually confirm that the Base64 data does not leak sensitive information, and that the data cannot be aggregated/used to exploit other vulnerabilities.

### Reference


* [ https://projects.webappsec.org/w/page/13246936/Information%20Leakage ](https://projects.webappsec.org/w/page/13246936/Information%20Leakage)


#### CWE Id: [ 200 ](https://cwe.mitre.org/data/definitions/200.html)


#### WASC Id: 13

#### Source ID: 3

### [ Non-Storable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are not storable by caching components such as proxy servers. If the response does not contain sensitive, personal or user-specific information, it may benefit from being stored and cached, to improve performance.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `DELETE `
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: ``
  * Attack: ``
  * Evidence: `DELETE `
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/assigned
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/days_info/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location/from/from/to/to
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/outlet/outlet_id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/encrypted
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `PATCH `
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``

Instances: 12

### Solution

The content may be marked as storable by ensuring that the following conditions are satisfied:
The request method must be understood by the cache and defined as being cacheable ("GET", "HEAD", and "POST" are currently defined as cacheable)
The response status code must be understood by the cache (one of the 1XX, 2XX, 3XX, 4XX, or 5XX response classes are generally understood)
The "no-store" cache directive must not appear in the request or response header fields
For caching by "shared" caches such as "proxy" caches, the "private" response directive must not appear in the response
For caching by "shared" caches such as "proxy" caches, the "Authorization" header field must not appear in the request, unless the response explicitly allows it (using one of the "must-revalidate", "public", or "s-maxage" Cache-Control response directives)
In addition to the conditions above, at least one of the following conditions must also be satisfied by the response:
It must contain an "Expires" header field
It must contain a "max-age" response directive
For "shared" caches such as "proxy" caches, it must contain a "s-maxage" response directive
It must contain a "Cache Control Extension" that allows it to be cached
It must have a status code that is defined as cacheable by default (200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501).   

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Re-examine Cache-control Directives ](https://www.zaproxy.org/docs/alerts/10015/)



##### Informational (Low)

### Description

The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/assigned
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/location
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/status/encrypted
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/bot/bot_uuid/usage/totals
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/search
  * Method: `POST`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 7

### Solution

For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching ](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching)
* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
* [ https://grayduck.mn/2021/09/13/cache-control-recommendations/ ](https://grayduck.mn/2021/09/13/cache-control-recommendations/)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### WASC Id: 13

#### Source ID: 3

### [ Sec-Fetch-Dest Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies how and where the data would be used. For instance, if the value is audio, then the requested resource must be audio data and not any other type of resource.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 3

### Solution

Ensure that Sec-Fetch-Dest header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Mode Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Allows to differentiate between requests for navigating between HTML pages and requests for loading resources like images, audio etc.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 3

### Solution

Ensure that Sec-Fetch-Mode header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Site Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies the relationship between request initiator's origin and target's origin.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 3

### Solution

Ensure that Sec-Fetch-Site header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-User Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies if a navigation request was initiated by a user.

* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `DELETE`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/customer/id
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/equipment/equipment_id/outlet/outlet_id
  * Method: `POST`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: 3

### Solution

Ensure that Sec-Fetch-User header is included in user initiated requests.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-User)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3


