# Alreaed

Full-stack web application with a **.NET 9 Web API** back end and an **Angular 19** (SSR) front end.

## Structure

```
back/    .NET solution: alraed.API آ· alraed.Core آ· alraed.infrastructure
front/   Angular application (alraed)
```

## Back end

- ASP.NET Core Web API with **Scalar** API reference
- Entity Framework Core + **SQL Server**, ASP.NET Core Identity
- **JWT** authentication
- **Redis** caching (StackExchange.Redis)
- Email sending via **MailKit / MimeKit**
- FluentValidation

## Front end

- **Angular 19** with Server-Side Rendering
- Angular Material + CDK, **Flowbite**
- **Tiptap** rich-text editor
- Excel import/export (`xlsx`), toasts and spinners

## Getting Started

```bash
git clone https://github.com/Ahmadjarad47/Alreaed.git

# back end  (requires .NET 9 SDK, SQL Server, Redis)
cd Alreaed/back
dotnet restore
dotnet run --project alraed.API

# front end (requires Node.js 20+)
cd ../front
npm install
npm start
```

Configure connection strings, JWT settings and SMTP credentials in `appsettings.Development.json` (never commit secrets).

## Author

**Ahmad Jarad** â€” [GitHub](https://github.com/Ahmadjarad47)