## SOCIAL MEDIA COMMUNICATION APPLICATION

- To run, open powershell and run `.\create-projects-win.ps1` but make sure you already have `Microsoft dotnet` installed in your pc.
- Then enter the API folder directory and run `dotnet run`.
- To use the sqlite database, you `ctrl + alt + p` then you put in the `Microsoft.EntityFrameworkCore.Sqlite` and install in the 'Persistence' folder. Make sure that the version of .net Core you've installed is same with the one you'll be selecting when installing the package.
- We have to use tools to run our database. So run `dotnet tool list -g` to check the list of tools and the version.
- install the tools from 'https://www.nuget.org/packages/dotnet-ef', then run the command `dotnet tool install --global dotnet-ef --version 7.0.8` 7.0.8 depends on the version you're using for you ASP.NET framework. Then invoke the tool by running `dotnet-ef`. The ef stands for 'Entity Framework'

- To use the command migration you run `dotnet ef migrations add IntialCreate -s API -p Persistence`. This takes two switches: API and Persistence

- You might have an error for the first time, because the API hasn't `Microsoft.EntityFrameworkCore.Design` installed into it
- To reload the app `dotnet watch --no-hot-reload`
- CORS : Cross Origin Request Sharing
- We'll install a mediator in the Application folder. This allows both the API and the Application folder to interact
- in the Clean Architecture, the Application folder contains all our bussiness logic while the API is the interface adapters.
- install `mediatR.Extensions.Microsoft.DependencyInjection`, this helps to communicate between Application folder and the Api folder. This is used because the Api depends on the Application but the application doesn't, so this package helps the application folder to send back information to the api.
- CQRS: `Command Query Responsibility Segregation`. Commands doesn't return a value, but it modifies states, e.g create, modify an activity. Query: don't modify state but returns a value e.g, getting an activitiy detail(id).
- install `AutoMapper.Extensions.Microsoft.DependencyInjection` inside the application
- install `npm i mobx mobx-react-lite` which helps to centralise all react components so as not to go through passing down states to child components

- install `npm i react-router-dom` to implement the react router functionality

-`npm i react-calendar` then `npm i @types/react-calendar` to install a calendar package

- Handling error validation through `fluentValidation.AspNetCore` inside the NeGet Gallery, install inside the application app.

- making toast using react toastify `npm i react-toastify`



droping the database  `dotnet ef database drop -s API -p Persistence`
Removing a package from dotnet `dotnet remove package <package name>`