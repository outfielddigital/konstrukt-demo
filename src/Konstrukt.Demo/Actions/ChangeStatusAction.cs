using Konstrukt.Configuration.Actions;
using Konstrukt.Configuration.Builders;
using Konstrukt.Demo.Models;
using Konstrukt.Demo.ValueMappers;
using Konstrukt.Persistence;
using System;
using System.Linq;

namespace Konstrukt.Demo.Actions
{
    public class ChangeStatusAction : KonstruktAction<ChangeStatusSettings, KonstruktActionResult>
    {
        private readonly IKonstruktRepositoryFactory _repoFactory;

        public override string Icon => "icon-nodes";
        public override string Alias => "changestatus";
        public override string Name => "Change Status";

        public ChangeStatusAction(IKonstruktRepositoryFactory repoFactory)
        {
            _repoFactory = repoFactory;
        }

        public override void Configure(KonstruktSettingsConfigBuilder<ChangeStatusSettings> settingsConfig)
        {
            settingsConfig.AddFieldset("General", fieldsetConfig => fieldsetConfig
                .AddField(s => s.Status).SetDataType("Comment Status").SetValueMapper<EnumDropdownValueMapper<CommentStatus>>()
            );
        }

        public override bool IsVisible(KonstruktActionVisibilityContext ctx)
        {
            return ctx.ActionType == KonstruktActionType.Bulk
                || ctx.ActionType == KonstruktActionType.Row;
        }

        public override KonstruktActionResult Execute(string collectionAlias, object[] entityIds, ChangeStatusSettings settings)
        {
            try
            {
                var repo = _repoFactory.GetRepository<Comment, int>(collectionAlias);

                var ids = entityIds.Select(x => int.Parse(x?.ToString())).ToArray();
                var result = repo.GetAll(x => ids.Contains(x.Id));

                if (result.Success)
                {
                    foreach (var entity in result.Model)
                    {
                        entity.Status = settings.Status;

                        repo.Save(entity);
                    }
                }

                return new KonstruktActionResult(true);
            }
            catch (Exception ex)
            {
                return new KonstruktActionResult(false, new KonstruktActionNotification("Failed to update status", ex.Message));
            }
        }
    }

    public class ChangeStatusSettings
    {
        public CommentStatus Status { get; set; }
    }
}
