REM First, install wget from http://gnuwin32.sourceforge.net/packages/wget.htm

REM Second, install swagger-codegen-cli using: 
REM wget http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.9/swagger-codegen-cli-2.4.9.jar -O swagger-codegen-cli.jar
REM make sure the jar file is in C:\Programs\SwaggerCodeGen\

REM Third, make sure that java is installed as its bin directory is on the Path environment variable

REM then, browse to the trawex-adapter directory and run this batch file
java -jar C:\Programs\SwaggerCodeGen\swagger-codegen-cli.jar generate -i api/swagger.yaml -l nodejs-server -o .