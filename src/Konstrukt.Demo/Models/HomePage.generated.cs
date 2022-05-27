//------------------------------------------------------------------------------
// <auto-generated>
//   This code was generated by a tool.
//
//    Umbraco.ModelsBuilder.Embedded v10.0.0-rc4+9ff06ee
//
//   Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Linq.Expressions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Infrastructure.ModelsBuilder;
using Umbraco.Cms.Core;
using Umbraco.Extensions;

namespace Konstrukt.Demo.Models
{
	/// <summary>Home Page</summary>
	[PublishedModel("homePage")]
	public partial class HomePage : PublishedContentModel, IAdvanced, IMetaData
	{
		// helpers
#pragma warning disable 0109 // new is redundant
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		public new const string ModelTypeAlias = "homePage";
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public new static IPublishedContentType GetModelContentType(IPublishedSnapshotAccessor publishedSnapshotAccessor)
			=> PublishedModelUtility.GetModelContentType(publishedSnapshotAccessor, ModelItemType, ModelTypeAlias);
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[return: global::System.Diagnostics.CodeAnalysis.MaybeNull]
		public static IPublishedPropertyType GetModelPropertyType<TValue>(IPublishedSnapshotAccessor publishedSnapshotAccessor, Expression<Func<HomePage, TValue>> selector)
			=> PublishedModelUtility.GetModelPropertyType(GetModelContentType(publishedSnapshotAccessor), selector);
#pragma warning restore 0109

		private IPublishedValueFallback _publishedValueFallback;

		// ctor
		public HomePage(IPublishedContent content, IPublishedValueFallback publishedValueFallback)
			: base(content, publishedValueFallback)
		{
			_publishedValueFallback = publishedValueFallback;
		}

		// properties

		///<summary>
		/// Description: A description for the site, to be used in taglines and auto-generated page titles.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("siteDescription")]
		public virtual string SiteDescription => this.Value<string>(_publishedValueFallback, "siteDescription");

		///<summary>
		/// Name: A name for the site, to be used in taglines and auto-generated page titles.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("siteName")]
		public virtual string SiteName => this.Value<string>(_publishedValueFallback, "siteName");

		///<summary>
		/// Raw Markup: DANGEROUS! Drop in any raw markup to be appended before the closing body tag across ALL pages of the site. Used mostly for analytics code snippets. It's best not to use this field unless you know what you are doing.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("siteRawMarkup")]
		public virtual string SiteRawMarkup => this.Value<string>(_publishedValueFallback, "siteRawMarkup");

		///<summary>
		/// Raw Markup: DANGEROUS! Drop in any raw markup to be appended before the closing body tag. Used mostly for analytics code snippets. It's best not to use this field unless you know what you are doing.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("rawMarkup")]
		public virtual string RawMarkup => global::Konstrukt.Demo.Models.Advanced.GetRawMarkup(this, _publishedValueFallback);

		///<summary>
		/// Redirect to Node: If sets redirects any request for this page to the linked page instead.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("umbracoRedirect")]
		public virtual global::Umbraco.Cms.Core.Models.PublishedContent.IPublishedContent UmbracoRedirect => global::Konstrukt.Demo.Models.Advanced.GetUmbracoRedirect(this, _publishedValueFallback);

		///<summary>
		/// URL Alias: Defines a comma-separated list of alternative URLs this page should be accessible from. Good for marketing purposes.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("umbracoUrlAlias")]
		public virtual string UmbracoUrlAlias => global::Konstrukt.Demo.Models.Advanced.GetUmbracoUrlAlias(this, _publishedValueFallback);

		///<summary>
		/// URL Name: Overrides the default URL name.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("umbracoUrlName")]
		public virtual string UmbracoUrlName => global::Konstrukt.Demo.Models.Advanced.GetUmbracoUrlName(this, _publishedValueFallback);

		///<summary>
		/// Meta Description: Appears in Google search results. It should be descriptive and in complete sentences. Include value statements and a call-to-action (click here, learn more by clicking here, download here, view video, etc) so people click the link. Include relevant keywords. 50-155 characters.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("metaDescription")]
		public virtual string MetaDescription => global::Konstrukt.Demo.Models.MetaData.GetMetaDescription(this, _publishedValueFallback);

		///<summary>
		/// Meta Image: Used mostly by social media services such as Twitter and Facebook. The image that should be displayed as a preview for this page. If one is not defined one will try to be worked out from the pages content where possible.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("metaImage")]
		public virtual global::Umbraco.Cms.Core.Models.MediaWithCrops MetaImage => global::Konstrukt.Demo.Models.MetaData.GetMetaImage(this, _publishedValueFallback);

		///<summary>
		/// Meta Keywords: Used by smaller search engines but not Google, Bing or Yahoo. The meta keywords to display to search engines. List in order of relevance and importance. Separate words or phrases with a comma. Include misspellings and variations. Include action words such as buy, shop, find, download or words related to your industry.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("metaKeywords")]
		public virtual string MetaKeywords => global::Konstrukt.Demo.Models.MetaData.GetMetaKeywords(this, _publishedValueFallback);

		///<summary>
		/// Meta Title: Overrides the default page title.
		///</summary>
		[global::System.CodeDom.Compiler.GeneratedCodeAttribute("Umbraco.ModelsBuilder.Embedded", "10.0.0-rc4+9ff06ee")]
		[global::System.Diagnostics.CodeAnalysis.MaybeNull]
		[ImplementPropertyType("metaTitle")]
		public virtual string MetaTitle => global::Konstrukt.Demo.Models.MetaData.GetMetaTitle(this, _publishedValueFallback);
	}
}
