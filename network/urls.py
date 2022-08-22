
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>/<int:id>", views.profile, name="profile"),
    path("following/", views.following, name="following"),

    #API
    path("new_post", views.new_post, name="new_post"),

    path("posts/<str:endpoint>", views.posts, name="posts"),
    path("following/<str:endpoint>", views.following_api, name="following_api"),
    path("profile/<str:username>/<int:id>/<str:endpoint>", views.profile_posts, name="profile_posts"),

    path("follow/<int:user_id>", views.follow, name="follow"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit-post"),
    path("following/edit_post/<int:post_id>", views.edit_post, name="edit-post"),
]

