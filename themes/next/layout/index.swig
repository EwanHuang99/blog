{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}{{ config.title }}{% if theme.index_with_subtitle and config.subtitle %} - {{config.subtitle }}{% endif %}{% endblock %}

{% block page_class %}
  {% if is_home() %}page-home{% endif -%}
{% endblock %}

{% block content %}
   <section id="posts" class="posts-expand">
    <div class="post-block">
      <div id="banner">
        <h1 class="quotes" id="wisdom"></h1>
      </div>

      <div class="content-list">
        {% for post in page.posts %}
        <div class="list-item">
          <a href={{ url_for(post.path)}}><span class="item-title" title={{post.title}}>{{ post.title }} </span> <span class="item-time">{{date(post.date, 'YYYY-MM-DD')}}</span></a>
        </div>
        <div class="clearfix"></div>
        {% endfor %}
      </div>

    </div>

    {#}{% for post in page.posts %}
      {{ post_template.render(post, true) }}
    {% endfor %}{#}
  </section>

  {% include '_partials/pagination.swig' %}
{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
