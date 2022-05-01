# Commands

## on linux after installing the dotnet-ef

 put this in your profile so that it's in your path
 `export PATH="$PATH:$HOME/.dotnet/tools/"`

## Start the migrations and make the folder

`dotnet-ef.exe migrations add InitialCreate -o Data/Migrations`

## update to the latest migration

`dotnet ef database update`


## Delete the db
`dotnet ef database drop`