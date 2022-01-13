using System;
using Konstrukt.Demo.Models;
using Konstrukt.Demo.Web.Dtos;
using Konstrukt.Persistence;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Web.Website.Controllers;

namespace Konstrukt.Demo.Web.Controllers
{
    public class CommentSurfaceController : SurfaceController
    {
        private readonly IKonstruktRepositoryFactory _repoFactory;

        public CommentSurfaceController(IUmbracoContextAccessor umbracoContextAccessor, IUmbracoDatabaseFactory databaseFactory,
            ServiceContext services, AppCaches appCaches, IProfilingLogger profilingLogger, IPublishedUrlProvider publishedUrlProvider,
            IKonstruktRepositoryFactory repoFactory)
            : base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
        {
            _repoFactory = repoFactory;
        }

        public IActionResult SubmitComment(SubmitCommentDto model)
        {
            if (!ModelState.IsValid)
                return CurrentUmbracoPage();

            try
            {
                var repo = _repoFactory.GetRepository<Comment, int>();

                var comment = new Comment 
                {
                    NodeUdi = Udi.Create(Constants.UdiEntityType.Document, CurrentPage.Key).ToString(),
                    Name = model.Name,
                    Email = model.Email,
                    Body = model.Body,
                    Status = CommentStatus.Pending
                };

                repo.Save(comment);

                TempData["CommentStatus"] = "submitted";

                return RedirectToCurrentUmbracoPage();
            }
            catch(Exception ex)
            {
                ModelState.AddModelError("", "An error occured submitting the comment");

                return CurrentUmbracoPage();
            }
        }
    }
}