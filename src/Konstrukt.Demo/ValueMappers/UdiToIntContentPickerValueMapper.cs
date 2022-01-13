using System;
using System.Linq;
using Konstrukt.Mapping;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace Konstrukt.Demo.ValueMappers
{
    public class UdiToIntContentPickerValueMapper : KonstruktValueMapper
    {
        private readonly IIdKeyMap _idKeyMap;
        
        public UdiToIntContentPickerValueMapper(IIdKeyMap idKeyMap)
        {
            _idKeyMap = idKeyMap;
        }
        
        public override object ModelToEditor(object input)
        {
            if (input == null) 
                return null;

            var inputStr = input.ToString();
            if (inputStr.IsNullOrWhiteSpace())
                return null;

            var udis = inputStr.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => UdiParser.Parse(x))
                .ToList();

            var ids = udis.Select(_idKeyMap.GetIdForUdi)
                .Where(x => x.Success)
                .Select(x => x.Result)
                .ToList();

            return string.Join(',', ids);
        }

        public override object EditorToModel(object input)
        {
            if (input == null) 
                return null;

            var inputStr = input.ToString();
            if (inputStr.IsNullOrWhiteSpace())
                return null;
            
            var ids = inputStr.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => int.Parse(x))
                .ToList();
            
            var udis = ids.Select(x => _idKeyMap.GetUdiForId(x, UmbracoObjectTypes.Document))
                .Where(x => x.Success)
                .Select(x => x.Result.ToString())
                .ToList();

            return string.Join(',', udis);
        }
    }
}