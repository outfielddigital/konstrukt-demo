using System.Reflection;
using Konstrukt.Demo.Models;
using Konstrukt.Demo.ValueMappers;
using Konstrukt.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Models;

namespace Konstrukt.Demo
{
    public static class UmbracoBuilderExtensions
    {
        public static IUmbracoBuilder AddKonstruktDemo(this IUmbracoBuilder builder)
        {
            builder.Services.AddSingleton<UdiToIntContentPickerValueMapper>();
            
            builder.AddKonstrukt(cfg =>
            {
                cfg.AddContextAppAfter("umbContent", "Comments", "icon-chat", ctxAppConfig => ctxAppConfig
                    .SetVisibility(appCtx => appCtx.Source is IContent content && content.ContentType.Alias == "blogPostPage")
                    .AddCollection<Comment>(x => x.Id, x => x.NodeUdi, "Comment", "Comments", "A collection of comments", "icon-chat", "icon-chat", collectionConfig => collectionConfig
                        .SetAlias("relatedComments") // All collection aliases must be globally unique
                        .SetNameProperty(c => c.Name)
                        .SetDateCreatedProperty(c => c.DateCreated)
                        .AddSearchableProperty(c => c.Email)
                        .ListView(listViewConfig => listViewConfig
                            .AddField(c => c.Email)
                            .AddField(c => c.Status)
                        ) 
                        .Editor(editorConfig => editorConfig
                            .AddTab("General", tabConfig => tabConfig
                                .AddFieldset("General", fieldsetConfig => fieldsetConfig
                                    .AddField(c => c.Email).SetValidationRegex("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+")
                                    .AddField(c => c.Body).SetDataType("Textarea")
                                    .AddField(c => c.Status).SetDataType("Comment Status").SetValueMapper<EnumDropdownValueMapper<CommentStatus>>()
                                )
                            )
                        )
                    )
                );
                
                cfg.AddDashboard("Pending Comments", dashboardConfig => dashboardConfig
                    .SetVisibility(cfg2 => cfg2.ShowInSection("content"))
                    .SetCollection<Comment>(x => x.Id, "Comment", "Comments", "A collection of comments", "icon-chat", "icon-chat", collectionConfig => collectionConfig
                        .SetAlias("pendingComments") // All collection aliases must be globally unique
                        .SetNameProperty(c => c.Name)
                        .SetDateCreatedProperty(c => c.DateCreated)
                        .AddSearchableProperty(c => c.Email)
                        .SetFilter(x => x.Status == CommentStatus.Pending)
                        .DisableCreate()
                        .ListView(listViewConfig => listViewConfig
                            .AddField(c => c.Email)
                            .AddField(c => c.Status)
                        ) 
                        .Editor(editorConfig => editorConfig
                            .AddTab("General", tabConfig => tabConfig
                                .AddFieldset("General", fieldsetConfig => fieldsetConfig
                                    .AddField(c => c.NodeUdi).SetLabel("Node").SetDataType("Content Picker").SetValueMapper<UdiToIntContentPickerValueMapper>()
                                    .AddField(c => c.Email).SetValidationRegex("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+")
                                    .AddField(c => c.Body).SetDataType("Textarea")
                                    .AddField(c => c.Status).SetDataType("Comment Status").SetValueMapper<EnumDropdownValueMapper<CommentStatus>>()
                                )
                            )
                        )
                    )
                );

                cfg.AddSectionAfter("media", "Repositories", sectionConfig => sectionConfig
                    .Tree(treeConfig => treeConfig
                        .AddCollection<Comment>(x => x.Id, "Comment", "Comments", "A collection of comments", "icon-chat", "icon-chat", collectionConfig => collectionConfig
                            .SetAlias("comments") // All collection aliases must be globally unique
                            .SetNameProperty(c => c.Name)
                            .SetDateCreatedProperty(c => c.DateCreated)
                            .AddSearchableProperty(c => c.Email)
                            .ListView(listViewConfig => listViewConfig
                                .AddDataView("Status", "All", x => x.Status == CommentStatus.Pending || x.Status == CommentStatus.Approved || x.Status == CommentStatus.Rejected)
                                .AddDataView("Status", "Pending", x => x.Status == CommentStatus.Pending)
                                .AddDataView("Status", "Approved", x => x.Status == CommentStatus.Approved)
                                .AddDataView("Status", "Rejected", x => x.Status == CommentStatus.Rejected)
                                .AddField(c => c.Email)
                                .AddField(c => c.Status)
                            ) 
                            .Editor(editorConfig => editorConfig
                                .AddTab("General", tabConfig => tabConfig
                                    .AddFieldset("General", fieldsetConfig => fieldsetConfig
                                        .AddField(c => c.NodeUdi).SetLabel("Node").SetDataType("Content Picker").SetValueMapper<UdiToIntContentPickerValueMapper>()
                                        .AddField(c => c.Email).SetValidationRegex("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+")
                                        .AddField(c => c.Body).SetDataType("Textarea")
                                        .AddField(c => c.Status).SetDataType("Comment Status").SetValueMapper<EnumDropdownValueMapper<CommentStatus>>()
                                    )
                                )
                            )
                        )
                    )
                );

            });
            
            return builder;
        }
    }
}