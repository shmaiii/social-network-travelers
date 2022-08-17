
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
    path("post/<str:post_type>/", views.post, name="post"),
    path("follow/<int:user_id>", views.follow, name="follow"),
]

