USE [master]
GO
/****** Object:  Database [CourseCRUD]    Script Date: 02/20/2021 12:04:18 ******/
CREATE DATABASE [CourseCRUD]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CourseCRUD', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\CourseCRUD.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'CourseCRUD_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\CourseCRUD_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [CourseCRUD] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CourseCRUD].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CourseCRUD] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CourseCRUD] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CourseCRUD] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CourseCRUD] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CourseCRUD] SET ARITHABORT OFF 
GO
ALTER DATABASE [CourseCRUD] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CourseCRUD] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CourseCRUD] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CourseCRUD] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CourseCRUD] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CourseCRUD] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CourseCRUD] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CourseCRUD] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CourseCRUD] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CourseCRUD] SET  DISABLE_BROKER 
GO
ALTER DATABASE [CourseCRUD] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CourseCRUD] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CourseCRUD] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CourseCRUD] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CourseCRUD] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CourseCRUD] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CourseCRUD] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CourseCRUD] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CourseCRUD] SET  MULTI_USER 
GO
ALTER DATABASE [CourseCRUD] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CourseCRUD] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CourseCRUD] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CourseCRUD] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [CourseCRUD] SET DELAYED_DURABILITY = DISABLED 
GO
USE [CourseCRUD]
GO
/****** Object:  Table [dbo].[Course]    Script Date: 02/20/2021 12:04:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Course](
	[Id] [nvarchar](50) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](50) NULL,
 CONSTRAINT [PK_Course] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[Course] ([Id], [Name], [Description]) VALUES (N'7f852a85-8214-49b9-8ac2-7e5cf5cf50fb', N'Học ca', N'Ca trù ẻo')
INSERT [dbo].[Course] ([Id], [Name], [Description]) VALUES (N'8034ae8c-139b-4c3b-b2bd-eb002af59ecf', N'Học lội', N'Lội nồi lẩu')
INSERT [dbo].[Course] ([Id], [Name], [Description]) VALUES (N'9a2295ce-bd04-42e7-a3e8-9ccf9890ee14', N'Học múa', N'Múa cột')
INSERT [dbo].[Course] ([Id], [Name], [Description]) VALUES (N'f8e07b8e-826b-4fda-945e-930c1623154b', N'Học nhảy', N'Nhảy cầu Phú Cường')
USE [master]
GO
ALTER DATABASE [CourseCRUD] SET  READ_WRITE 
GO
