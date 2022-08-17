import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django import forms
from django.http import JsonResponse

from .models import *

def index(request):
    return render(request, "network/index.html", {
        "posts" : Post.objects.all().order_by("-time_posted")
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def new_post(request):
    if request.method == "POST":
        #get data
        data = json.loads(request.body)
        author = request.user
        location = data.get("location", "")
        content = data.get("content", "")
        image = data.get("image", "")
        
        # create post
        post = Post(post_author=author, location=location, content=content, images = image)
        post.save()

        return JsonResponse({"message": "New post has been successfully posted"}, status=201)
    return JsonResponse({"error": "new post failed"}, status = 400)

def profile(request, username, id):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(post_author=user)
    followers = User.objects.filter(following=user).count()
    following = user.following.all().count()
    
    if request.user in user.followers.all():
        followed = True
    else:
        followed = False

    return render (request, "network/profile.html", {
        "user": user,
        "posts": posts,
        "posts_count": posts.count(),
        "followers": followers,
        "following": following,
        "followed": followed
    })

def post(request, post_type):
    # if post_type is profile, user_id is profile user
    # else, user_id is request.user (not used)
    #try:
       # user = User.objects.get(pk=user_id)
    #except User.DoesNotExist:
     #   return JsonResponse({"error": "User not found"}, status = 404)

    #if post_type == "profile":
     #   posts = Post.objects.filter(post_author = user).order_by("-time_posted")

    if post_type == "all":
        posts = Post.objects.all().order_by("-time_posted")
        
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
def follow(request, user_id):
    user = User.objects.get(pk=user_id)

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("follow") is not None:
            if data["follow"] == "follow":
                request.user.following.add(user)
            elif data["follow"] == "unfollow":
                if user in request.user.following.all():
                    request.user.following.remove(user)
            user.save()
            request.user.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "Something went wrong"
        }, status = 400)

def following(request):
    following = request.user.following.all()
    posts = Post.objects.filter(post_author__in=following)

    return render(request, "network/following.html", {
        "posts":  posts,
    })
