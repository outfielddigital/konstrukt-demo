using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Konstrukt.Configuration.Builders.DataViews;
using Konstrukt.Demo.Models;
using Konstrukt.Models;

namespace Konstrukt.Demo.DataViews
{
    public class CommentStatusDataViewsBuilder : KonstruktDataViewsBuilder<Comment>
    {
        public override IEnumerable<KonstruktDataViewSummary> GetDataViews()
        {
            yield return new KonstruktDataViewSummary
            {
                Name = "All",
                Alias = "all",
                Group = "Status"
            };
            
            foreach (var val in Enum.GetValues<CommentStatus>())
            {
                yield return new KonstruktDataViewSummary
                {
                    Name = val.ToString(),
                    Alias = val.ToString().ToLower(),
                    Group = "Status"
                };
            }
        }

        public override Expression<Func<Comment, bool>> GetDataViewWhereClause(string dataViewAlias)
        {
            if (dataViewAlias == "all")
                return null;

            var commentStatus = Enum.Parse<CommentStatus>(dataViewAlias, true);
            
            return c => c.Status == commentStatus;
        }
    }
}