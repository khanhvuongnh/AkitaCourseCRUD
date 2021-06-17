CÂU LỆNH BUILD

1. DOTNET
$ $Env:ASPNETCORE_ENVIRONMENT = "Production"
$ dotnet publish -o 'D:\01. Source Code\CourseCRUD\CourseCRUD-API'

2. ANGULAR
$ ng build --prod --build-optimizer=false